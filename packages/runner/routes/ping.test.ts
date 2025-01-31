/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../__fixtures__'
import { createContext } from '../__fixtures__'

describe.concurrent<Context>('ping', () => {
  beforeEach<Context>(async(context) => {
    context.ctx = await createContext()
    await context.ctx.createServer()
  })

  afterEach<Context>(async(context) => {
    await context.ctx.destroy()
  })

  describe<Context>('ping', (it) => {
    it('should respond with status 200', async({ expect, ctx }) => {
      const headers = { Authorization: `Bearer ${ctx.ModuleRunner.runnerToken}` }
      const response = await ctx.fetch('/ping', { method: 'GET', headers })
      expect(response.status).toStrictEqual(200)
      expect(response.statusText).toStrictEqual('OK')
    })

    it('should respond with { ok: true }', async({ expect, ctx }) => {
      const headers = { Authorization: `Bearer ${ctx.ModuleRunner.runnerToken}` }
      const response = await ctx.fetch('/ping', { method: 'GET', headers })
      const data = await response.json()
      expect(data).toEqual({ ok: true })
    })
  })

  describe<Context>('unauthorized', (it) => {
    it('should respond with status 401', async({ expect, ctx }) => {
      const response = await ctx.fetch('/ping', { method: 'GET' })
      expect(response.status).toStrictEqual(401)
      expect(response.statusText).toStrictEqual('Unauthorized')
    })

    it('should respond with an error message', async({ expect, ctx }) => {
      const response = await ctx.fetch('/ping', { method: 'GET' })
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
