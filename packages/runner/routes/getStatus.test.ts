/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { TestApplication } from '@unserved/server'
import { createTestApplication } from '@unserved/server'
import { cpus } from 'node:os'
import { ModuleRunner } from '../application'

interface Context {
  application: TestApplication<ModuleRunner>
  moduleRunner: ModuleRunner
}

describe.concurrent<Context>('GET /status', { timeout: 300 }, () => {
  beforeEach<Context>(async(context) => {
    context.application = await createTestApplication([ModuleRunner])
    context.moduleRunner = context.application.getModule(ModuleRunner)
    await context.application.createTestServer()
  })

  afterEach<Context>(async({ application }) => {
    await application.destroy()
  })

  describe<Context>('getStatus', (it) => {
    it('should respond with status 200', async({ application, moduleRunner }) => {
      const headers = { Authorization: `Bearer ${moduleRunner.runnerToken}` }
      const response = await application.fetch('/status', { method: 'GET', headers })
      expect(response.status).toStrictEqual(200)
      expect(response.statusText).toStrictEqual('OK')
    })

    it('should respond with the worker pool status', async({ application, moduleRunner }) => {
      const headers = { Authorization: `Bearer ${moduleRunner.runnerToken}` }
      const response = await application.fetch('/status', { method: 'GET', headers })
      const data = await response.json() as Record<string, unknown[]>
      expect(data).toMatchObject({
        isClaimed: false,
        isRunning: false,
        isReachable: true,
        workerPool: expect.any(Array),
      })
      expect(data.workerPool).toHaveLength(cpus().length - 1)
      expect(data.workerPool[0]).toStrictEqual({
        running: 0,
        threadId: expect.any(Number),
        uptime: expect.any(Number),
        cpuUsage: {
          system: expect.any(Number),
          user: expect.any(Number),
        },
        memoryUsage: {
          arrayBuffers: expect.any(Number),
          external: expect.any(Number),
          heapTotal: expect.any(Number),
          heapUsed: expect.any(Number),
          rss: expect.any(Number),
        },
        resourceUsage: {
          fsRead: expect.any(Number),
          fsWrite: expect.any(Number),
          involuntaryContextSwitches: expect.any(Number),
          ipcReceived: expect.any(Number),
          ipcSent: expect.any(Number),
          majorPageFault: expect.any(Number),
          maxRSS: expect.any(Number),
          minorPageFault: expect.any(Number),
          sharedMemorySize: expect.any(Number),
          signalsCount: expect.any(Number),
          swappedOut: expect.any(Number),
          systemCPUTime: expect.any(Number),
          unsharedDataSize: expect.any(Number),
          unsharedStackSize: expect.any(Number),
          userCPUTime: expect.any(Number),
          voluntaryContextSwitches: expect.any(Number),
        },
      })
    })
  })

  describe<Context>('unauthorized', (it) => {
    it('should respond with status 401', async({ application }) => {
      const response = await application.fetch('/status', { method: 'GET' })
      expect(response.status).toStrictEqual(401)
      expect(response.statusText).toStrictEqual('Unauthorized')
    })

    it('should respond with an error message', async({ application }) => {
      const response = await application.fetch('/status', { method: 'GET' })
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
