// eslint-disable-next-line n/no-extraneous-import
import type { TestContext } from 'vitest'
import type { Project, ProjectPermission } from '../project'
import type { User, UserSession } from '../user'
import type { Workspace, WorkspacePermission } from '../workspace'
import { ModuleRunner } from '@nwrx/nano-runner'
import { createTestApplication } from '@unserved/server'
import { createCipheriv, createHash, randomBytes } from 'node:crypto'
import { ModuleFlow } from '../flow'
import { ModuleProject } from '../project'
import { ModuleStorage } from '../storage'
import { createStoragePoolFs } from '../storage/utils'
import { ModuleThread } from '../thread'
import { ModuleUser } from '../user'
import { createUser } from '../user/utils'
import { ModuleWorkspace } from '../workspace'

export type Context = Awaited<ReturnType<typeof createTestContext>>

export async function createTestContext(testContext: TestContext) {
  const application = await createTestApplication([
    ModuleUser,
    ModuleStorage,
    ModuleWorkspace,
    ModuleProject,
    ModuleFlow,
    ModuleThread,
  ], {
    storagePools: new Map([['default', createStoragePoolFs()]] as const),
    projectSecretKey: 'SECRET',
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
    get moduleThread() { return application.getModule(ModuleThread) },
    get moduleRunner() { return runner.getModule(ModuleRunner) },

    /************************************************/
    /* User module utilities.                       */
    /************************************************/

    createUser: async(name = 'jdoe', options: Partial<User> = {}) => {
      const userModule = application.getModule(ModuleUser)
      const workspaceModule = application.getModule(ModuleWorkspace)
      const password = randomBytes(16).toString('hex')
      let { user, workspace } = await createUser.call(userModule, {
        email: `${name}@acme.com`,
        username: name,
        password,
      })

      // --- Assign the super administrator role.
      // @ts-expect-error: allow unsafe assignment.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      for (const property in options) user[property] = options[property]

      // --- Create the session entity.
      const { UserSession } = userModule.getRepositories()
      const session = UserSession.create({
        user,
        address: '127.0.0.1',
        userAgent: 'Mozilla/5.0',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
      })

      // --- Create the token for the session.
      const iv = Buffer.alloc(16, 0)
      const key = createHash('sha256').update(userModule.userSecretKey).digest()
      const token = createCipheriv(userModule.userCypherAlgorithm, key, iv).update(session.id).toString('hex')

      // --- Create the cookie header.
      const cookie = `${userModule.userSessionCookieName}=${token}`
      const headers = { cookie, 'user-agent': 'Mozilla/5.0' } as Record<string, string>

      // --- Save the user and workspace.
      const { User } = userModule.getRepositories()
      const { Workspace } = workspaceModule.getRepositories()
      user = await User.save(user)
      await UserSession.save(session)
      workspace = await Workspace.save(workspace)

      // --- Return all the created entities and the headers to use in requests.
      return { user, session, headers, password, workspace }
    },

    createSession: async(user: User, options: Partial<UserSession> = {}) => {
      const userModule = application.getModule(ModuleUser)
      const { UserSession } = userModule.getRepositories()
      const session = UserSession.create({
        user,
        address: '127.0.0.1',
        userAgent: 'Mozilla/5.0',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
        ...options,
      })

      // --- Create the token for the session.
      const iv = Buffer.alloc(16, 0)
      const key = createHash('sha256').update(userModule.userSecretKey).digest()
      const token = createCipheriv(userModule.userCypherAlgorithm, key, iv).update(session.id).toString('hex')

      // --- Create the cookie header.
      const cookie = `${userModule.userSessionCookieName}=${token}`
      const headers = { cookie, 'user-agent': session.userAgent } as Record<string, string>
      await UserSession.save(session)
      return { session, headers }
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
  }

  Object.assign(testContext, context)
  return context
}
