// eslint-disable-next-line n/no-extraneous-import
import type { TestContext } from 'vitest'
import type { Flow, FlowPermission } from '../flow'
import type { Project, ProjectPermission } from '../project'
import type { User } from '../user'
import type { RegisterUserOptions } from '../user/utils'
import type { Workspace, WorkspacePermission } from '../workspace'
import { ModuleRunner } from '@nwrx/nano-runner'
import { createTestApplication, createTestEvent } from '@unserved/server'
import { randomBytes } from 'node:crypto'
import { ModuleFlow } from '../flow'
import { ModuleProject } from '../project'
import { ModuleStorage } from '../storage'
import { createStoragePoolFs } from '../storage/utils'
import { ModuleThread } from '../thread'
import { ModuleThreadRunner } from '../threadRunner'
import { ModuleUser } from '../user'
import { createSession, registerUser } from '../user/utils'
import { ModuleVault } from '../vault'
import { ModuleWorkspace } from '../workspace'
import { FIXTURE_USER_BASIC } from './entities'

export type Context = Awaited<ReturnType<typeof createTestContext>>

export async function createTestContext(testContext: TestContext) {
  const application = await createTestApplication([
    ModuleUser,
    ModuleStorage,
    ModuleWorkspace,
    ModuleProject,
    ModuleFlow,
    ModuleVault,
    ModuleThread,
    ModuleThreadRunner,
  ], {
    storagePools: new Map([['default', createStoragePoolFs()]] as const),
    vaultConfigurationAlgorithm: 'aes-256-gcm',
    vaultConfigurationSecretKey: 'secret-key',
    vaultDefaultLocalSecretKey: 'secret-key',
  })

  const runner = await createTestApplication([ModuleRunner])
  const context = {
    application,
    runner,

    /************************************************/
    /* Modules                                      */
    /************************************************/

    get moduleUser() { return application.getModule(ModuleUser) },
    get moduleStorage() { return application.getModule(ModuleStorage) },
    get moduleWorkspace() { return application.getModule(ModuleWorkspace) },
    get moduleProject() { return application.getModule(ModuleProject) },
    get moduleFlow() { return application.getModule(ModuleFlow) },
    get moduleVault() { return application.getModule(ModuleVault) },
    get moduleThread() { return application.getModule(ModuleThread) },
    get moduleThreadRunner() { return application.getModule(ModuleThreadRunner) },
    get moduleRunner() { return runner.getModule(ModuleRunner) },

    /************************************************/
    /* User module utilities.                       */
    /************************************************/

    setupUser: async(options: RegisterUserOptions = FIXTURE_USER_BASIC) => {
      const moduleUser = application.getModule(ModuleUser)
      const { user, workspace /* vault */ } = await registerUser.call(moduleUser, options)

      // --- Assign extra options to the user.
      // @ts-expect-error: allow unsafe assignment.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      for (const property in options) user[property] = options[property]
      await moduleUser.getRepositories().User.save(user)

      // --- Create the session for the user.
      const event = createTestEvent({ headers: { 'user-agent': 'Mozilla/5.0' } })
      const session = await createSession.call(moduleUser, event, { user })
      await moduleUser.getRepositories().UserSession.save(session)

      // --- Extract the cookies from the response headers so we can reuse the session.
      const setCookie = event.node.res.getHeader('set-cookie') as string[]
      const entries = setCookie.map((cookie) => {
        const name = cookie.split('=')[0]
        const value = cookie.split('=')[1].split(';')[0]
        return `${name}=${value}`
      })
      const headers = {
        'cookie': entries.join('; '),
        'user-agent': 'Mozilla/5.0',
      }

      // --- Return all the created entities and the headers to use in requests.
      return { user, workspace, /* vault, */ session, headers }
    },

    createAvatar: async(user: User, data?: Buffer) => {
      const storageModule = application.getModule(ModuleStorage)
      const { UserProfile } = application.getModule(ModuleUser).getRepositories()
      if (!data) data = randomBytes(1024)
      const avatar = await storageModule.upload({
        pool: 'default',
        size: data.length,
        type: 'image/png',
        data,
        name: 'avatar.png',
        origin: 'test',
      })
      user.profile!.avatar = avatar
      await UserProfile.save(user.profile!)
      return {
        data: new Uint8Array(data),
        avatar,
      }
    },

    /************************************************/
    /* Workspace                                    */
    /************************************************/

    createWorkspace: async(name = 'my-workspace', isPublic = false) => {
      const { Workspace } = application.getModule(ModuleWorkspace).getRepositories()
      const workspace = Workspace.create({ name, isPublic })
      return { workspace: await Workspace.save(workspace) }
    },

    assignWorkspace: async(workspace: Workspace, user: User, permission?: WorkspacePermission) => {
      if (!permission) return { assignment: undefined }
      const { WorkspaceAssignment } = application.getModule(ModuleWorkspace).getRepositories()
      const assignment = WorkspaceAssignment.create({ workspace, user, permission })
      return { assignment: await WorkspaceAssignment.save(assignment) }
    },

    /************************************************/
    /* Vault                                        */
    /************************************************/

    // createVault: async(name = 'my-vault', user: User, workspace: Workspace, options: Partial<Vault> = {}) => {
    //   const moduleVault = application.getModule(ModuleVault)
    //   const { Vault } = moduleVault.getRepositories()

    //   // --- Encrypt the configuration using the module's encryption key.
    //   const configurationJson = JSON.stringify({ algorithm: 'aes-256-gcm', secret: 'secret-key' })
    //   const configurationEncrypted = await encrypt(
    //     configurationJson,
    //     moduleVault.vaultConfigurationSecretKey,
    //     moduleVault.vaultConfigurationAlgorithm,
    //   )

    //   const vault = Vault.create({
    //     createdBy: user,
    //     name,
    //     type: 'local',
    //     workspace,
    //     configuration: configurationEncrypted,
    //     ...options,
    //   })

    //   return { vault: await Vault.save(vault) }
    // },

    /************************************************/
    /* Project                                      */
    /************************************************/

    createProject: async(name = 'my-project', workspace: Workspace, options: Partial<Project> = {}) => {
      const { Project } = application.getModule(ModuleProject).getRepositories()
      const project = Project.create({ name, title: name, workspace, ...options })
      return { project: await Project.save(project) }
    },

    assignProject: async(project: Project, user: User, permission?: ProjectPermission) => {
      if (!permission) return { assignment: undefined }
      const { ProjectAssignment } = application.getModule(ModuleProject).getRepositories()
      const assignment = ProjectAssignment.create({ project, user, permission })
      return { assignment: await ProjectAssignment.save(assignment) }
    },

    /************************************************/
    /* Flow                                         */
    /************************************************/

    createFlow: async(name = 'my-flow', project: Project, options: Partial<Flow> = {}) => {
      const { Flow } = application.getModule(ModuleFlow).getRepositories()
      const flow = Flow.create({ name, title: name, project, ...options })
      return { flow: await Flow.save(flow) }
    },

    assignFlow: async(flow: Flow, user: User, permission?: FlowPermission) => {
      if (!permission) return { assignment: undefined }
      const { FlowAssignment } = application.getModule(ModuleFlow).getRepositories()
      const assignment = FlowAssignment.create({ flow, user, permission })
      return { assignment: await FlowAssignment.save(assignment) }
    },

  }

  Object.assign(testContext, context)
  return context
}
