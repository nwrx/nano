import type { Server } from 'node:http'
import type { User } from '../user'
import type { Workspace, WorkspaceProject } from '../workspace'
import type { WorkspacePermission, WorkspaceProjectPermission } from '../workspace/utils'
import { Application } from '@unserved/server'
import { randomUUID } from 'node:crypto'
import { rm } from 'node:fs/promises'
import { get } from 'node:http'
import { ModuleFlow } from '../flow'
import { ModuleUser } from '../user'
import { ModuleWorkspace } from '../workspace'

export interface Context {
  ctx: Awaited<ReturnType<typeof createContext>>
  ModuleWorkspace: ModuleWorkspace
}

export async function createContext() {
  const id = randomUUID()
  const socket = `/tmp/${id}.sock`
  const application = await Application.initialize([ModuleFlow, ModuleUser, ModuleWorkspace], {
    projectSecretKey: 'TEST_SECRET_KEY',
    userTrustProxy: true,
    dataSource: {
      name: id,
      type: 'sqlite',
      synchronize: true,
      database: ':memory:',
    },
  })

  return {
    application,
    server: undefined as Server | undefined,

    async createServer(): Promise<void> {
      this.server = this.application.createServer()
      await new Promise((resolve, reject) => {
        this.server!.on('error', reject)
        this.server!.on('listening', resolve)
        this.server!.listen(socket)
      })
    },

    fetch: async(path: string, options: RequestInit = {}): Promise<Response> =>
      new Promise((resolve, reject) => {
        const request = get({
          path,
          socketPath: socket,
          method: options.method,
          headers: {
            ...options.headers as Record<string, string>,
            'X-Forwarded-For': '1.2.3.4',
            'User-Agent': 'Vitest',
          },
        },

        // --- Handle incoming response.
        (response) => {
          let data = ''
          response.on('data', chunk => data += chunk)
          response.on('end', () => resolve({
            status: response.statusCode!,
            statusText: response.statusMessage!,
            headers: new Headers(response.headers as Record<string, string>),
            json: () => Promise.resolve(JSON.parse(data)),
            text: () => Promise.resolve(String(data)),
          } as Response))
        })

        request.on('error', reject)
        request.end()
      }),

    async destroy() {
      this.server?.close()
      await rm(socket, { force: true })
      await this.application?.dataSource?.destroy()
      this.server = undefined
    },

    [Symbol.dispose]() {
      void this.destroy()
    },

    // ----------------------------------------------
    // --- User module utilities.
    // ----------------------------------------------
    get ModuleUser() {
      return this.application.getModule(ModuleUser)
    },

    async createUser(name = 'jdoe') {
      const userModule = this.application.getModule(ModuleUser)
      const workspaceModule = this.application.getModule(ModuleWorkspace)
      const { user, workspace } = await userModule.createUser({
        email: `${name}@acme.com`,
        username: name,
        password: 'password',
      })

      // --- Save the user and workspace.
      const { User } = userModule.getRepositories()
      const { Workspace } = workspaceModule.getRepositories()
      await User.save(user)
      await Workspace.save(workspace)

      // --- Create the cookie header.
      const session = userModule.createSession(user, { address: '1.2.3.4', userAgent: 'Vitest' })
      const token = userModule.createSessionToken(session)
      const cookie = `${userModule.userSessionCookieName}=${token}`
      const headers = { cookie }
      return { user, session, headers, cookie }
    },

    // ----------------------------------------------
    // --- Workspace module utilities.
    // ----------------------------------------------
    get ModuleWorkspace() {
      return this.application.getModule(ModuleWorkspace)
    },

    async createWorkspace(name = 'my-workspace', isPublic = false) {
      const { Workspace } = this.ModuleWorkspace.getRepositories()
      const workspace = Workspace.create({ name, isPublic })
      return { workspace: await Workspace.save(workspace) }
    },

    async assignWorkspace(workspace: Workspace, user: User, permission?: WorkspacePermission) {
      if (!permission) return
      const { WorkspaceAssignment } = this.ModuleWorkspace.getRepositories()
      const assignment = WorkspaceAssignment.create({ workspace, user, permission })
      return { assignment: await WorkspaceAssignment.save(assignment) }
    },

    async createProject(name = 'my-project', workspace: Workspace, isPublic = false) {
      const { WorkspaceProject } = this.ModuleWorkspace.getRepositories()
      const project = WorkspaceProject.create({ name, workspace, isPublic })
      return { project: await WorkspaceProject.save(project) }
    },

    async assignProject(project: WorkspaceProject, user: User, permission?: WorkspaceProjectPermission) {
      if (!permission) return
      const { WorkspaceProjectAssignment } = this.ModuleWorkspace.getRepositories()
      const assignment = WorkspaceProjectAssignment.create({ project, user, permission })
      return { assignment: await WorkspaceProjectAssignment.save(assignment) }
    },
  }
}
