import type { Context } from '../../__fixtures__'
import { createTestContext } from '../../__fixtures__'

describe.concurrent('workspaceGet', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
    await context.application.createTestServer()
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  describe<Context>('with workspace owner', (it) => {
    it('should respond with status 200', async({ setupUser, setupWorkspace, application }) => {
      const { user, headers } = await setupUser()
      const { workspace } = await setupWorkspace({ user, assignments: [[user, 'Owner']] })
      const response = await application.fetch(`/workspaces/${workspace.name}`, { headers })
      const data = await response.json() as Record<string, unknown>
      expect(response).toMatchObject({ status: 200, statusText: 'OK' })
      expect(data).toMatchObject({ name: workspace.name })
    })
  })

  describe<Context>('with workspace reader', (it) => {
    it('should respond with status 200', async({ setupUser, setupWorkspace, application }) => {
      const { user, headers } = await setupUser()
      const { workspace } = await setupWorkspace({ user, assignments: [[user, 'Read']] })
      const response = await application.fetch(`/workspaces/${workspace.name}`, { headers })
      const data = await response.json() as Record<string, unknown>
      expect(response).toMatchObject({ status: 200, statusText: 'OK' })
      expect(data).toMatchObject({ name: workspace.name })
    })
  })

  describe<Context>('with public workspace', (it) => {
    it('should respond with the workspace object', async({ setupWorkspace, application }) => {
      const { workspace } = await setupWorkspace({ isPublic: true })
      const response = await application.fetch(`/workspaces/${workspace.name}`)
      const data = await response.json() as Record<string, unknown>
      expect(response).toMatchObject({ status: 200, statusText: 'OK' })
      expect(data).toMatchObject({ name: workspace.name })
    })
  })

  describe<Context>('with private workspace', (it) => {
    it('should respond with E_WORKSPACE_NOT_FOUND error', async({ setupWorkspace, application }) => {
      const { workspace } = await setupWorkspace()
      const response = await application.fetch(`/workspaces/${workspace.name}`)
      const data = await response.json() as Record<string, string>
      expect(response).toMatchObject({ status: 404, statusText: 'Not Found' })
      expect(data).toMatchObject({
        data: { name: 'E_WORKSPACE_NOT_FOUND' },
        stack: [],
        statusCode: 404,
        statusMessage: 'Not Found',
      })
    })
  })

  describe<Context>('errors', (it) => {
    it('should respond with status 404 if workspace does not exist', async({ setupUser, application }) => {
      const { headers } = await setupUser()
      const response = await application.fetch('/workspaces/not-found', { headers })
      const data = await response.json() as Record<string, string>
      expect(response.status).toBe(404)
      expect(response.statusText).toBe('Not Found')
      expect(data).toMatchObject({
        data: { name: 'E_WORKSPACE_NOT_FOUND' },
        stack: [],
        statusCode: 404,
        statusMessage: 'Not Found',
      })
    })
  })
})
