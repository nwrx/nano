/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { TestApplication } from '@unserved/server'
import { ModuleRunner } from '@nwrx/runner'
import { createTestApplication } from '@unserved/server'
import { ModuleThread } from '../index'
import { registerThreadRunner, ThreadRunner } from './registerThreadRunner'

interface Context {
  application: TestApplication<ModuleThread>
  runner: TestApplication<ModuleRunner>
  moduleRunner: ModuleRunner
  moduleThread: ModuleThread
}

describe<Context>('registerThreadRunner', () => {
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
    it('should return a ThreadRunner instance', async({ moduleThread }) => {
      const runner = await registerThreadRunner.call(moduleThread, 'http://localhost')
      expect(runner).toBeInstanceOf(ThreadRunner)
    })
  })

  describe<Context>('ping', (it) => {
    it('should ping the thread runner', async({ moduleThread }) => {
      const runner = await registerThreadRunner.call(moduleThread, 'http://localhost')
      const result = await runner.ping()
      expect(result).toStrictEqual({ ok: true })
    })
  })

  describe<Context>('getStatus', (it) => {
    it('should get the status of the thread runner', async({ moduleThread }) => {
      const runner = await registerThreadRunner.call(moduleThread, 'http://localhost')
      const result = await runner.getStatus()
      expect(result).toStrictEqual({ workerPool: expect.any(Array) })
    })
  })
})
