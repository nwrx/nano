import type { Context } from '../../__fixtures__'
import { createTestContext } from '../../__fixtures__'

describe.concurrent('flowCreate', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
    await context.application.createTestServer()
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  describe<Context>('with super administrator', (it) => {
    it('should respond with status 200', async({ createUser, application, createWorkspace, createProject }) => {
      const { headers } = await createUser('admin', { isSuperAdministrator: true })
      const { workspace } = await createWorkspace('test-workspace')
      const { project } = await createProject('test-project', workspace)
      const body = JSON.stringify({
        workspace: workspace.name,
        project: project.name,
        name: 'test-flow',
        title: 'Test Flow',
        description: 'A test flow',
      })
      const response = await application.fetch('/api/flows', { method: 'POST', body, headers })
      expect(response.status).toBe(200)
      expect(response.statusText).toBe('OK')
    })

    it('should respond with the flow object', async({ createUser, application, createWorkspace, createProject }) => {
      const { headers } = await createUser('admin', { isSuperAdministrator: true })
      const { workspace } = await createWorkspace('test-workspace')
      const { project } = await createProject('test-project', workspace)
      const body = JSON.stringify({
        workspace: workspace.name,
        project: project.name,
        name: 'test-flow',
        title: 'Test Flow',
        description: 'A test flow',
      })
      const response = await application.fetch('/api/flows', { method: 'POST', body, headers })
      const data = await response.json() as Record<string, string>
      expect(data).toMatchObject({ name: 'test-flow', title: 'Test Flow', description: 'A test flow' })
    })

    it('should create a flow in the database', async({ createUser, application, createWorkspace, createProject, moduleFlow }) => {
      const { headers } = await createUser('admin', { isSuperAdministrator: true })
      const { workspace } = await createWorkspace('test-workspace')
      const { project } = await createProject('test-project', workspace)
      const body = JSON.stringify({
        workspace: workspace.name,
        project: project.name,
        name: 'test-flow',
        title: 'Test Flow',
        description: 'A test flow',
      })
      await application.fetch('/api/flows', { method: 'POST', body, headers })
      const { Flow } = moduleFlow.getRepositories()
      const flow = await Flow.findOneBy({ name: 'test-flow' })
      expect(flow).toMatchObject({
        name: 'test-flow',
        title: 'Test Flow',
        description: 'A test flow',
      })
    })

    it('should respond with a E_FLOW_NAME_TAKEN error if the name is already taken', async({ createUser, application, createWorkspace, createProject, moduleFlow }) => {
      const { headers } = await createUser('admin', { isSuperAdministrator: true })
      const { workspace } = await createWorkspace('test-workspace')
      const { project } = await createProject('test-project', workspace)
      const body = JSON.stringify({
        workspace: workspace.name,
        project: project.name,
        name: 'test-flow',
        title: 'Test Flow',
        description: 'A test flow',
      })
      await application.fetch('/api/flows', { method: 'POST', body, headers })
      const response = await application.fetch('/api/flows', { method: 'POST', body, headers })
      expect(response.status).toBe(409)
      const data = await response.json() as Record<string, any>
      expect(data.data.name).toBe('E_FLOW_NAME_TAKEN')
    })
  })

  describe<Context>('with authenticated user', (it) => {
    it('should respond with status 403', async({ createUser, application, createWorkspace, createProject }) => {
      const { headers } = await createUser('regular')
      const { workspace } = await createWorkspace('test-workspace')
      const { project } = await createProject('test-project', workspace)
      const body = JSON.stringify({
        workspace: workspace.name,
        project: project.name,
        name: 'test-flow',
        title: 'Test Flow',
        description: 'A test flow',
      })
      const response = await application.fetch('/api/flows', { method: 'POST', body, headers })
      expect(response.status).toBe(403)
    })

    it('should respond with a E_PROJECT_NOT_ALLOWED error', async({ createUser, application, createWorkspace, createProject }) => {
      const { headers } = await createUser('regular')
      const { workspace } = await createWorkspace('test-workspace')
      const { project } = await createProject('test-project', workspace)
      const body = JSON.stringify({
        workspace: workspace.name,
        project: project.name,
        name: 'test-flow',
        title: 'Test Flow',
        description: 'A test flow',
      })
      const response = await application.fetch('/api/flows', { method: 'POST', body, headers })
      const data = await response.json() as Record<string, any>
      expect(data.data.name).toBe('E_PROJECT_NOT_ALLOWED')
    })
  })

  describe<Context>('with unauthenticated user', (it) => {
    it('should respond with status 401', async({ application, createWorkspace, createProject }) => {
      const { workspace } = await createWorkspace('test-workspace')
      const { project } = await createProject('test-project', workspace)
      const body = JSON.stringify({
        workspace: workspace.name,
        project: project.name,
        name: 'test-flow',
        title: 'Test Flow',
        description: 'A test flow',
      })
      const response = await application.fetch('/api/flows', { method: 'POST', body })
      expect(response.status).toBe(401)
    })

    it('should respond with a E_USER_NOT_AUTHENTICATED error', async({ application, createWorkspace, createProject }) => {
      const { workspace } = await createWorkspace('test-workspace')
      const { project } = await createProject('test-project', workspace)
      const body = JSON.stringify({
        workspace: workspace.name,
        project: project.name,
        name: 'test-flow',
        title: 'Test Flow',
        description: 'A test flow',
      })
      const response = await application.fetch('/api/flows', { method: 'POST', body })
      const data = await response.json() as Record<string, any>
      expect(data.data.name).toBe('E_USER_NOT_AUTHENTICATED')
    })
  })
}, 1000)
