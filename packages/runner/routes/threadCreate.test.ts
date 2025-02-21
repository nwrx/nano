/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { TestApplication } from '@unserved/server'
import { createTestApplication } from '@unserved/server'
import { EXP_UUID } from '@unshared/validation'
import { ModuleRunner } from '../application'

interface Context {
  application: TestApplication<ModuleRunner>
  moduleRunner: ModuleRunner
  headers: Record<string, string>
}

describe.concurrent<Context>('POST /threads', { timeout: 300 }, () => {
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
      const body = JSON.stringify({ version: '1' })
      const response = await application.fetch('/threads', { method: 'POST', body, headers })
      const data = await response.json() as Record<string, unknown>
      expect(response).toMatchObject({ status: 200, statusText: 'OK' })
      expect(data).toMatchObject({ id: expect.stringMatching(EXP_UUID) })
    })
  })

  describe<Context>('error', (it) => {
    it('should fail with "E_UNAUTHORIZED" when token is invalid', async({ application }) => {
      const body = JSON.stringify({ version: '1' })
      const response = await application.fetch('/threads', { method: 'POST', body })
      expect(response).toMatchObject({ status: 401, statusText: 'Unauthorized' })
      const data = await response.json() as Record<string, unknown>
      expect(data.data).toMatchObject({ name: 'E_UNAUTHORIZED' })
    })

    it('should fail with "E_FLOW_VERSION_UNSUPPORTED" when version is invalid', async({ headers, application }) => {
      const body = JSON.stringify({ version: '0' })
      const response = await application.fetch('/threads', { method: 'POST', body, headers })
      expect(response).toMatchObject({ status: 400, statusText: 'Bad Request' })
      const data = await response.json() as Record<string, unknown>
      expect(data.data).toMatchObject({ name: 'E_FLOW_VERSION_UNSUPPORTED' })
    })
  })
})
