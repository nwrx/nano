/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { TestApplication } from '@unserved/server'
import { createTestApplication } from '@unserved/server'
import { ModuleRunner } from '../application'

interface Context {
  application: TestApplication<ModuleRunner>
  moduleRunner: ModuleRunner
}

describe.concurrent<Context>('ping', { timeout: 300 }, () => {
  beforeEach<Context>(async(context) => {
    context.application = await createTestApplication([ModuleRunner])
    context.moduleRunner = context.application.getModule(ModuleRunner)
    await context.application.createTestServer()
  })

  afterEach<Context>(async({ application }) => {
    await application.destroy()
  })

  describe<Context>('ping', (it) => {
    it('should respond with status 200', async({ expect, application, moduleRunner }) => {
      const headers = { Authorization: `Bearer ${moduleRunner.runnerToken}` }
      const response = await application.fetch('/ping', { method: 'GET', headers })
      expect(response.status).toStrictEqual(200)
      expect(response.statusText).toStrictEqual('OK')
    })

    it('should respond with { ok: true }', async({ expect, application, moduleRunner }) => {
      const headers = { Authorization: `Bearer ${moduleRunner.runnerToken}` }
      const response = await application.fetch('/ping', { method: 'GET', headers })
      const data = await response.json()
      expect(data).toEqual({ ok: true })
    })
  })

  describe<Context>('unauthorized', (it) => {
    it('should respond with status 401', async({ expect, application }) => {
      const response = await application.fetch('/ping', { method: 'GET' })
      expect(response.status).toStrictEqual(401)
      expect(response.statusText).toStrictEqual('Unauthorized')
    })

    it('should respond with an error message', async({ expect, application }) => {
      const response = await application.fetch('/ping', { method: 'GET' })
      const data = await response.json() as Record<string, string>
      expect(data).toMatchObject({
        data: { message: 'Not authorized', name: 'E_NOT_AUTHORIZED' },
        stack: [],
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    })
  })
})
