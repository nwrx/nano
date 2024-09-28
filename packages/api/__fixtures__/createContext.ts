import type { Server } from 'node:http'
import type { User } from '../user'
import type { Workspace, WorkspaceProject } from '../workspace'
import type { WorkspacePermission, WorkspaceProjectPermission } from '../workspace/utils'
import { Application } from '@unserved/server'
import { randomUUID } from 'node:crypto'
import { rm } from 'node:fs/promises'
import { request } from 'node:http'
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
        const clientRequest = request({
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
          setTimeout(reject, 10)
          response.on('data', chunk => data += chunk)
          response.on('error', (error) => {
            reject(error)
            response.resume()
          })
          response.on('end', () => resolve({
            status: response.statusCode!,
            statusText: response.statusMessage!,
            headers: new Headers(response.headers as Record<string, string>),
            json: () => Promise.resolve(JSON.parse(data)),
            text: () => Promise.resolve(String(data)),
          } as Response))
        })

        // --- Write the request body.
        if (options.body) clientRequest.write(options.body, 'utf8')
        clientRequest.end()
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

    async createUser(name = 'jdoe', options: Partial<User> = {}) {
      const userModule = this.application.getModule(ModuleUser)
      const workspaceModule = this.application.getModule(ModuleWorkspace)
      const { user, workspace } = await userModule.createUser({
        email: `${name}@acme.com`,
        username: name,
        password: 'password',
      })

      // --- Assign the super administrator role.
      // @ts-expect-error: allow unsafe assignment.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      for (const property in options) user[property] = options[property]

      // --- Create the cookie header.
      const { session, token } = userModule.createSession(user, { address: '1.2.3.4', userAgent: 'Vitest' })
      const cookie = `${userModule.userSessionCookieName}=${token}`
      const headers = { cookie }

      // --- Save the user and workspace.
      const { User, UserSession } = userModule.getRepositories()
      const { Workspace } = workspaceModule.getRepositories()
      await User.save(user)
      await UserSession.save(session)
      await Workspace.save(workspace)

      // --- Return all the created entities and the headers to use in requests.
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
      const project = WorkspaceProject.create({ name, title: name, workspace, isPublic })
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
