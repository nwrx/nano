import type { TestApplication } from '@unserved/server'
import { ModuleRunner } from '@nwrx/runner'
import { createTestApplication } from '@unserved/server'
import { ModuleThread } from '..'
import { ThreadRunner } from '../utils'

interface Context {
  application: TestApplication<ModuleThread>
  runner: TestApplication<ModuleRunner>
  moduleRunner: ModuleRunner
  moduleThread: ModuleThread
}

describe<Context>('claim', () => {
  beforeEach<Context>(async(context) => {
    context.application = await createTestApplication([ModuleThread])
    context.runner = await createTestApplication([ModuleRunner])
    context.moduleThread = context.application.getModule(ModuleThread)
    context.moduleRunner = context.runner.getModule(ModuleRunner)
    await context.application.createTestServer()
    await context.runner.createTestServer()

    // --- Since the 'POST /api/runners' will be calling `fetch` on the runner and that
    // --- the runner listens on a Unix socket, we need to stub the global fetch function
    // --- with one that supports Unix sockets.
    vi.stubGlobal('fetch', async(url: string, options: RequestInit) => {
      const path = new URL(url).pathname
      return context.runner.fetch(path, options)
    })
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
    await context.runner.destroy()
    vi.unstubAllGlobals()
  })

  describe<Context>('claim', (it) => {
    it('should respond with status 204', async({ expect, application }) => {
      const body = JSON.stringify({ baseUrl: 'http://localhost' })
      const response = await application.fetch('/api/runners', { method: 'POST', body })
      expect(response.status).toStrictEqual(204)
      expect(response.statusText).toStrictEqual('No Content')
    })

    it('should register the thread runner', async({ expect, application, moduleThread }) => {
      const body = JSON.stringify({ baseUrl: 'http://localhost' })
      await application.fetch('/api/runners', { method: 'POST', body })
      const runner = moduleThread.threadRunners.get('http://localhost')
      expect(moduleThread.threadRunners.size).toStrictEqual(1)
      expect(runner).toBeInstanceOf(ThreadRunner)
    })
  })

  describe<Context>('schema', (it) => {
    it('should throw an error when the body is not an object', async({ expect, application }) => {
      const body = JSON.stringify('http://localhost')
      const response = await application.fetch('/api/runners', { method: 'POST', body })
      expect(response.status).toStrictEqual(400)
      expect(response.statusText).toStrictEqual('Validation Error')
    })
  })

  describe<Context>('conflict', (it) => {
    it('should respond with status 409 when already claimed', async({ expect, application, moduleRunner }) => {
      moduleRunner.runnerIsClaimed = true
      const body = JSON.stringify({ baseUrl: 'http://localhost' })
      const response = await application.fetch('/api/runners', { method: 'POST', body })
      expect(response.status).toStrictEqual(409)
      expect(response.statusText).toStrictEqual('Conflict')
    })
  })
})
