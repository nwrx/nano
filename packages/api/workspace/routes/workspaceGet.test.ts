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
    it('should respond with status 200', async({ createUser, createWorkspace, moduleWorkspace, application }) => {
      const { user, headers } = await createUser('owner')
      const { workspace } = await createWorkspace('workspace')
      await moduleWorkspace.assignWorkspace({ user, workspace, permission: 'Owner' })
      const response = await application.fetch('/api/workspaces/workspace', { headers })
      expect(response.status).toBe(200)
      expect(response.statusText).toBe('OK')
    })

    it('should respond with the workspace object', async({ createUser, createWorkspace, moduleWorkspace, application }) => {
      const { user, headers } = await createUser('owner')
      const { workspace } = await createWorkspace('workspace')
      await moduleWorkspace.assignWorkspace({ user, workspace, permission: 'Owner' })
      const response = await application.fetch('/api/workspaces/workspace', { headers })
      const data = await response.json() as Record<string, unknown>
      expect(data).toMatchObject({ id: workspace.id })
    })
  })

  describe<Context>('with workspace member', (it) => {
    it('should respond with status 200 for read permission', async({ createUser, createWorkspace, moduleWorkspace, application }) => {
      const { user, headers } = await createUser('member')
      const { workspace } = await createWorkspace('workspace')
      await moduleWorkspace.assignWorkspace({ user, workspace, permission: 'Read' })
      const response = await application.fetch('/api/workspaces/workspace', { headers })
      expect(response.status).toBe(200)
    })

    it('should respond with the workspace object', async({ createUser, createWorkspace, moduleWorkspace, application }) => {
      const { user, headers } = await createUser('member')
      const { workspace } = await createWorkspace('workspace')
      await moduleWorkspace.assignWorkspace({ user, workspace, permission: 'Read' })
      const response = await application.fetch('/api/workspaces/workspace', { headers })
      const data = await response.json() as Record<string, unknown>
      expect(data).toMatchObject({ id: workspace.id })
    })
  })

  describe<Context>('with public workspace', (it) => {
    it('should respond with the workspace object', async({ createWorkspace, application }) => {
      const { workspace } = await createWorkspace('workspace', true)
      const response = await application.fetch('/api/workspaces/workspace')
      const data = await response.json() as Record<string, unknown>
      expect(response.status).toBe(200)
      expect(response.statusText).toBe('OK')
      expect(data).toMatchObject({ id: workspace.id })
    })
  })

  describe<Context>('with private workspace', (it) => {
    it('should respond with status 404 for unauthenticated user', async({ createWorkspace, application }) => {
      await createWorkspace('workspace')
      const response = await application.fetch('/api/workspaces/workspace')
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

    it('should respond with E_WORKSPACE_NOT_FOUND error', async({ createWorkspace, application }) => {
      await createWorkspace('workspace')
      const response = await application.fetch('/api/workspaces/workspace')
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

  describe<Context>('errors', (it) => {
    it('should respond with status 404 if workspace does not exist', async({ createUser, application }) => {
      const { headers } = await createUser()
      const response = await application.fetch('/api/workspaces/not-found', { headers })
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
}, 1000)
