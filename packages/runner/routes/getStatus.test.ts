/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../__fixtures__'
import { cpus } from 'node:os'
import { createContext } from '../__fixtures__'

describe.concurrent<Context>('getStatus', () => {
  beforeEach<Context>(async(context) => {
    context.ctx = await createContext()
    await context.ctx.createServer()
  })

  afterEach<Context>(async(context) => {
    await context.ctx.destroy()
  })

  describe<Context>('getStatus', (it) => {
    it('should respond with status 200', async({ expect, ctx }) => {
      const headers = { Authorization: `Bearer ${ctx.ModuleRunner.runnerToken}` }
      const response = await ctx.fetch('/status', { method: 'GET', headers })
      expect(response.status).toStrictEqual(200)
      expect(response.statusText).toStrictEqual('OK')
    })

    it('should respond with the worker pool status', async({ expect, ctx }) => {
      const headers = { Authorization: `Bearer ${ctx.ModuleRunner.runnerToken}` }
      const response = await ctx.fetch('/status', { method: 'GET', headers })
      const data = await response.json() as Record<string, unknown[]>
      expect(data.workerPool).toBeInstanceOf(Array)
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
    it('should respond with status 401', async({ expect, ctx }) => {
      const response = await ctx.fetch('/status', { method: 'GET' })
      expect(response.status).toStrictEqual(401)
      expect(response.statusText).toStrictEqual('Unauthorized')
    })

    it('should respond with an error message', async({ expect, ctx }) => {
      const response = await ctx.fetch('/status', { method: 'GET' })
      const data = await response.json() as Record<string, string>
      expect(data).toMatchObject({
        data: { message: 'Not authorized', name: 'E_NOT_AUTHORIZED' },
        stack: [],
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    })
  })
}, 1000)
