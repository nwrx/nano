import type { TestApplication } from '@unserved/server'
import { createTestApplication } from '@unserved/server'
import { ModuleRunner } from '../application'

interface Context {
  application: TestApplication<ModuleRunner>
  moduleRunner: ModuleRunner
}

describe.concurrent<Context>('release', { timeout: 300 }, () => {
  beforeEach<Context>(async(context) => {
    context.application = await createTestApplication([ModuleRunner])
    context.moduleRunner = context.application.getModule(ModuleRunner)
    await context.application.createTestServer()
  })

  afterEach<Context>(async({ application }) => {
    await application.destroy()
  })

  describe<Context>('release', (it) => {
    it('should respond with status 200', async({ expect, application, moduleRunner }) => {
      const headers = { Authorization: `Bearer ${moduleRunner.runnerToken}` }
      await application.fetch('/claim', { method: 'POST' })
      const response = await application.fetch('/release', { method: 'POST', headers })
      expect(response).toMatchObject({ status: 204, statusText: 'No Content' })
    })

    it('should reset the runner claimed state', async({ expect, application, moduleRunner }) => {
      const headers = { Authorization: `Bearer ${moduleRunner.runnerToken}` }
      await application.fetch('/claim', { method: 'POST' })
      await application.fetch('/release', { method: 'POST', headers })
      expect(moduleRunner.runnerIsClaimed).toStrictEqual(false)
      expect(moduleRunner.runnerMasterAddress).toBe('127.0.0.1')
    })

    it('should destroy all worker threads', async({ expect, application, moduleRunner }) => {
      const headers = { Authorization: `Bearer ${moduleRunner.runnerToken}` }
      await application.fetch('/claim', { method: 'POST' })
      moduleRunner.runnerWorkerPool.initialize()
      expect(moduleRunner.runnerWorkerPool.workers).not.toHaveLength(0)
      await application.fetch('/release', { method: 'POST', headers })
      expect(moduleRunner.runnerWorkerPool.workers).toHaveLength(0)
    })
  })

  describe<Context>('not claimed', (it) => {
    it('should respond with status 409', async({ expect, application, moduleRunner }) => {
      const headers = { Authorization: `Bearer ${moduleRunner.runnerToken}` }
      const response = await application.fetch('/release', { method: 'POST', headers })
      expect(response.status).toStrictEqual(409)
      expect(response.statusText).toStrictEqual('Conflict')
    })

    it('should respond with an error message', async({ expect, application, moduleRunner }) => {
      const headers = { Authorization: `Bearer ${moduleRunner.runnerToken}` }
      const response = await application.fetch('/release', { method: 'POST', headers })
      const data = await response.json() as Record<string, string>
      expect(data).toMatchObject({
        data: { message: 'Runner is not claimed', name: 'E_RUNNER_NOT_CLAIMED' },
        stack: [],
        statusCode: 409,
        statusMessage: 'Conflict',
      })
    })
  })

  describe<Context>('unauthorized', (it) => {
    it('should respond with status 401', async({ expect, application }) => {
      const response = await application.fetch('/release', { method: 'POST' })
      expect(response.status).toStrictEqual(401)
      expect(response.statusText).toStrictEqual('Unauthorized')
    })

    it('should respond with an error message', async({ expect, application }) => {
      const response = await application.fetch('/release', { method: 'POST' })
      const data = await response.json() as Record<string, string>
      expect(data).toMatchObject({
        data: { message: 'Not authorized', name: 'E_UNAUTHORIZED' },
        stack: [],
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    })
  })
})
