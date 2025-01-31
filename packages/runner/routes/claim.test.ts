/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { TestApplication } from '@unserved/server'
import { createTestApplication } from '@unserved/server'
import { EXP_UUID } from '@unshared/validation'
import { ModuleRunner } from '../module'

interface Context {
  application: TestApplication<ModuleRunner>
  moduleRunner: ModuleRunner
}

describe.concurrent<Context>('claim', () => {
  beforeEach<Context>(async(context) => {
    context.application = await createTestApplication([ModuleRunner])
    context.moduleRunner = context.application.getModule(ModuleRunner)
    await context.application.createTestServer()
  })

  afterEach<Context>(async({ application }) => {
    await application.destroy()
  })

  describe<Context>('getToken', (it) => {
    it('should respond with status 200', async({ expect, application }) => {
      const response = await application.fetch('/claim', { method: 'POST' })
      expect(response.status).toStrictEqual(200)
      expect(response.statusText).toStrictEqual('OK')
    })

    it('should respond with the token', async({ expect, application }) => {
      const response = await application.fetch('/claim', { method: 'POST' })
      const data = await response.json() as Record<string, string>
      expect(data).toMatchObject({ token: expect.stringMatching(EXP_UUID) })
    })

    it('should set the "runnerIsClaimed" flag', async({ application, moduleRunner }) => {
      await application.fetch('/claim', { method: 'POST' })
      expect(moduleRunner.runnerIsClaimed).toStrictEqual(true)
    })

    it('should set the "runnerMasterAddress" property from the "X-Forwarded-For" header', async({ application, moduleRunner }) => {
      moduleRunner.runnerTrustProxy = true
      await application.fetch('/claim', { method: 'POST', headers: { 'X-Forwarded-For': '0.0.0.0' } })
      expect(moduleRunner.runnerMasterAddress).toStrictEqual('0.0.0.0')
    })

    it('should set the "runnerMasterAddress" property from the socket address', async({ application, moduleRunner }) => {
      moduleRunner.runnerTrustProxy = false
      await application.fetch('/claim', { method: 'POST' })
      expect(moduleRunner.runnerMasterAddress).toStrictEqual('127.0.0.1')
    })
  })

  describe<Context>('conflict', (it) => {
    it('should respond with status 409', async({ expect, application }) => {
      await application.fetch('/claim', { method: 'POST' })
      const response = await application.fetch('/claim', { method: 'POST' })
      expect(response.status).toStrictEqual(409)
      expect(response.statusText).toStrictEqual('Conflict')
    })

    it('should respond with an error message', async({ expect, application }) => {
      await application.fetch('/claim', { method: 'POST' })
      const response = await application.fetch('/claim', { method: 'POST' })
      const data = await response.json() as Record<string, string>
      expect(data).toMatchObject({
        data: { message: 'Runner is already claimed', name: 'E_RUNNER_ALREADY_CLAIMED' },
        stack: [],
        statusCode: 409,
        statusMessage: 'Conflict',
      })
    })
  })
})
