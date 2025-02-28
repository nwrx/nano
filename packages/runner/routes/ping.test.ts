import type { TestApplication } from '@unserved/server'
import { createTestApplication } from '@unserved/server'
import { ModuleRunner } from '../application'

interface Context {
  application: TestApplication<ModuleRunner>
  moduleRunner: ModuleRunner
}

describe.concurrent<Context>('GET /ping', () => {
  beforeEach<Context>(async(context) => {
    context.application = await createTestApplication([ModuleRunner])
    context.moduleRunner = context.application.getModule(ModuleRunner)
    await context.application.createTestServer()
  })

  afterEach<Context>(async({ application }) => {
    await application.destroy()
  })

  describe<Context>('ping', (it) => {
    it('should respond with status 200', async({ expect, application }) => {
      const response = await application.fetch('/ping', { method: 'GET' })
      const data = await response.bytes()
      expect(response).toMatchObject({ status: 200, statusText: 'OK' })
      expect(data).toStrictEqual(new Uint8Array())
    })
  })
})
