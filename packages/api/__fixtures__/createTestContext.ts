// eslint-disable-next-line n/no-extraneous-import
import type { TestContext } from 'vitest'
import type { FlowPermission } from '../flow'
import type { Project, ProjectPermission } from '../project'
import type { User } from '../user'
import type { VaultPermission } from '../vault'
import type { VaultConfiguration } from '../vault/utils'
import type { Workspace, WorkspacePermission } from '../workspace'
import { ModuleRunner } from '@nwrx/nano-runner'
import { createTestApplication, createTestEvent } from '@unserved/server'
import { randomBytes } from 'node:crypto'
import { ModuleFlow } from '../flow'
import { ModuleProject } from '../project'
import { ModuleRegistry } from '../registry'
import { ModuleStorage } from '../storage'
import { createStoragePoolFs } from '../storage/utils'
import { ModuleThread } from '../thread'
import { ModuleThreadRunner } from '../threadRunner'
import { ModuleUser } from '../user'
import { createSession, registerUser } from '../user/utils'
import { ModuleVault } from '../vault'
import { createVault } from '../vault/utils'
import { ModuleWorkspace } from '../workspace'

export const FIXTURE_USER = {
  username: randomBytes(4).toString('hex'),
  email: `${randomBytes(4).toString('hex')}@acme.com`,
}

export type Context = Awaited<ReturnType<typeof createTestContext>>

export interface SetupWorkspaceOptions {
  user?: User
  name?: string
  isPublic?: boolean
  assignments?: Array<[undefined | User, ...Array<undefined | WorkspacePermission>]>
}

export interface SetupProjectOptions {
  user?: User
  name?: string
  isPublic?: boolean
  workspace?: Workspace
  assignments?: Array<[undefined | User, ...Array<ProjectPermission | undefined>]>
}

export interface SetupVaultOptions {
  user?: User
  name?: string
  workspace?: Workspace
  configuration?: VaultConfiguration
  assignments?: Array<[undefined | User, ...Array<undefined | VaultPermission>]>
}

export interface SetupFlowOptions {
  user?: User
  name?: string
  project?: Project
  isPublic?: boolean
  assignments?: Array<[undefined | User, ...Array<FlowPermission | undefined>]>
}

export interface SetupRegistryCollectionOptions {
  user?: User
  name?: string
  workspace?: Workspace
}

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
    ModuleRegistry,
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
    /* Module getters                               */
    /************************************************/

    get moduleUser() { return application.getModule(ModuleUser) },
    get moduleStorage() { return application.getModule(ModuleStorage) },
    get moduleWorkspace() { return application.getModule(ModuleWorkspace) },
    get moduleProject() { return application.getModule(ModuleProject) },
    get moduleFlow() { return application.getModule(ModuleFlow) },
    get moduleVault() { return application.getModule(ModuleVault) },
    get moduleThread() { return application.getModule(ModuleThread) },
    get moduleThreadRunner() { return application.getModule(ModuleThreadRunner) },
    get moduleRegistry() { return application.getModule(ModuleRegistry) },
    get moduleRunner() { return runner.getModule(ModuleRunner) },

    /************************************************/
    /* Context creation utilities                   */
    /************************************************/

    setupUser: async(options: Partial<User> = {}) => {
      const {
        username = randomBytes(4).toString('hex'),
        email = `${randomBytes(4).toString('hex')}@acme.com`,
        ...properties
      } = options

      const moduleUser = application.getModule(ModuleUser)
      const { user, workspace /* vault */ } = await registerUser.call(moduleUser, { username, email })

      // --- Assign extra options to the user.
      // @ts-expect-error: allow unsafe assignment.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      for (const property in properties) user[property] = properties[property]
      await moduleUser.getRepositories().User.save(user)

      // --- Create the session for the user.
      const event = createTestEvent({ headers: { 'user-agent': 'Mozilla/5.0' } })
      const session = await createSession.call(moduleUser, event, { user })
      await moduleUser.getRepositories().UserSession.save(session)

      // --- Extract the "Set-Cookie" headers so we can reuse the session.
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

    setupWorkspace: async(options: SetupWorkspaceOptions = {}) => {
      const moduleWorkspace = application.getModule(ModuleWorkspace)

      // --- Create the workspace with the given options.
      const { Workspace, WorkspaceAssignment } = moduleWorkspace.getRepositories()
      const { assignments, isPublic, user, name = randomBytes(8).toString('hex') } = options
      const workspace = Workspace.create({ name, isPublic, createdBy: user, assignments: [] })

      // --- Assign the user to the workspace with the given permissions.
      if (assignments) {
        for (const assignment of assignments) {
          const [user, ...permissions] = assignment
          if (!user) continue
          const permissionsUnique = [...new Set(permissions)].filter(Boolean)
          for (const permission of permissionsUnique) {
            const assignment = WorkspaceAssignment.create({ workspace, user, permission })
            workspace.assignments!.push(assignment)
          }
        }
      }

      // --- If no user was provided, create one and set it as the creator.
      if (!user) {
        const { user } = await context.setupUser()
        workspace.createdBy = user
      }

      // --- Save the workspace and assignments.
      await Workspace.save(workspace)
      return { workspace }
    },

    setupProject: async(options: SetupProjectOptions = {}) => {
      const moduleProject = application.getModule(ModuleProject)

      // --- Create the project with the given options.
      const { Project, ProjectAssignment } = moduleProject.getRepositories()
      const { assignments, workspace, isPublic, user, name = randomBytes(8).toString('hex') } = options
      const project = Project.create({
        name,
        title: name,
        isPublic,
        workspace: workspace ?? await context.setupWorkspace().then(x => x.workspace),
        createdBy: user ?? await context.setupUser().then(x => x.user),
        assignments: [],
      })

      // --- Assign the user to the project with the given permissions.
      if (assignments) {
        for (const assignment of assignments) {
          const [user, ...permissions] = assignment
          if (!user) continue
          const permissionsUnique = [...new Set(permissions)].filter(Boolean)
          for (const permission of permissionsUnique) {
            const assignment = ProjectAssignment.create({ project, user, permission })
            project.assignments!.push(assignment)
          }
        }
      }

      // --- Save the project and assignments.
      await Project.save(project)
      return { project }
    },

    setupVault: async(options: SetupVaultOptions = {}) => {
      const moduleVault = application.getModule(ModuleVault)

      // --- Create the vault with the given options.
      const { Vault, VaultAssignment } = moduleVault.getRepositories()
      const vault = await createVault.call(moduleVault, {
        name: options.name ?? randomBytes(8).toString('hex'),
        user: options.user! ?? await context.setupUser().then(x => x.user),
        workspace: options.workspace! ?? await context.setupWorkspace().then(x => x.workspace),
        configuration: options.configuration ?? { algorithm: 'aes-256-gcm', secret: 'SECRET' },
      })

      // --- Assign the user to the vault with the given permissions.
      if (options.assignments) {
        for (const assignment of options.assignments) {
          const [user, ...permissions] = assignment
          if (!user) continue
          const permissionsUnique = [...new Set(permissions)].filter(Boolean)
          for (const permission of permissionsUnique) {
            const assignment = VaultAssignment.create({ vault, user, permission })
            vault.assignments = vault.assignments ?? []
            vault.assignments.push(assignment)
          }
        }
      }

      // --- Save the vault and assignments.
      await Vault.save(vault)
      return { vault }
    },

    setupFlow: async(options: SetupFlowOptions = {}) => {
      const moduleFlow = application.getModule(ModuleFlow)

      // --- Create the flow with the given options.
      const { Flow, FlowAssignment } = moduleFlow.getRepositories()
      const { assignments, project, isPublic, user, name = randomBytes(8).toString('hex') } = options
      const flow = Flow.create({ name, project, title: name, isPublic, createdBy: user, assignments: [] })

      // --- Assign the user to the flow with the given permissions.
      if (assignments) {
        for (const assignment of assignments) {
          const [user, ...permissions] = assignment
          if (!user) continue
          const permissionsUnique = [...new Set(permissions)].filter(Boolean)
          for (const permission of permissionsUnique) {
            const assignment = FlowAssignment.create({ flow, user, permission })
            flow.assignments!.push(assignment)
          }
        }
      }

      // --- If no user was provided, create one and set it as the creator.
      if (!user) {
        const { user } = await context.setupUser()
        flow.createdBy = user
      }

      // --- Save the flow and assignments.
      await Flow.save(flow)
      return { flow }
    },

    setupRegistryCollection: async(options: SetupRegistryCollectionOptions = {}) => {
      const moduleRegistry = application.getModule(ModuleRegistry)

      // --- Create the collection with the given options.
      const { RegistryCollection } = moduleRegistry.getRepositories()
      const { user, workspace, name = randomBytes(8).toString('hex') } = options
      const collection = RegistryCollection.create({ name, title: name, workspace, createdBy: user })

      // --- If no user was provided, create one and set it as the creator.
      if (!collection.createdBy) {
        const { user } = await context.setupUser()
        collection.createdBy = user
      }

      // --- Save the collection.
      await RegistryCollection.save(collection)
      return { collection }
    },
  }

  Object.assign(testContext, context)
  return context
}
