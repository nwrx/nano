import type { TestApplication } from '@unserved/server'
import { createTestApplication } from '@unserved/server'
import { ModuleRunner } from '../application'

interface Context {
  application: TestApplication<ModuleRunner>
  moduleRunner: ModuleRunner
  headers: Record<string, string>
}

describe.concurrent<Context>('POST /threads', () => {
  beforeEach<Context>(async(context) => {
    context.application = await createTestApplication([ModuleRunner])
    context.moduleRunner = context.application.getModule(ModuleRunner)
    context.headers = { Authorization: `Bearer ${context.moduleRunner.runnerToken}` }
    await context.application.createTestServer()
  })

  afterEach<Context>(async({ application }) => {
    await application.destroy()
  })

  describe<Context>('createThread', (it) => {
    it('should respond with status 200', async({ headers, application }) => {
      const id = '00000000-0000-0000-0000-000000000000'
      const body = JSON.stringify({ flow: { version: '1' } })
      const response = await application.fetch(`/threads/${id}`, { method: 'POST', body, headers })
      expect(response).toMatchObject({ status: 201, statusText: 'Created' })
    })
  })

  describe<Context>('error', (it) => {
    it('should fail with "E_UNAUTHORIZED" when token is invalid', async({ application }) => {
      const id = '00000000-0000-0000-0000-000000000000'
      const body = JSON.stringify({ flow: { version: '1' } })
      const response = await application.fetch(`/threads/${id}`, { method: 'POST', body })
      expect(response).toMatchObject({ status: 401, statusText: 'Unauthorized' })
      const data = await response.json() as Record<string, unknown>
      expect(data.data).toMatchObject({ name: 'E_UNAUTHORIZED' })
    })

    it('should fail with "E_FLOW_VERSION_UNSUPPORTED" when version is invalid', async({ headers, application }) => {
      const id = '00000000-0000-0000-0000-000000000000'
      const body = JSON.stringify({ flow: { version: '0' } })
      const response = await application.fetch(`/threads/${id}`, { method: 'POST', body, headers })
      expect(response).toMatchObject({ status: 400, statusText: 'Bad Request' })
      const data = await response.json() as Record<string, unknown>
      expect(data.data).toMatchObject({ name: 'E_FLOW_VERSION_UNSUPPORTED' })
    })

    it('should faile with "E_THREAD_ALREADY_INSTANTIATED" when thread already exists', async({ headers, application }) => {
      const id = '00000000-0000-0000-0000-000000000000'
      const body = JSON.stringify({ flow: { version: '1' } })
      await application.fetch(`/threads/${id}`, { method: 'POST', body, headers })
      const response = await application.fetch(`/threads/${id}`, { method: 'POST', body, headers })
      expect(response).toMatchObject({ status: 409, statusText: 'Conflict' })
      const data = await response.json() as Record<string, unknown>
      expect(data.data).toMatchObject({ name: 'E_THREAD_ALREADY_INSTANTIATED' })
    })
  })
})
