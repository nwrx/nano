/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../__fixtures__'
import { EXP_UUID } from '@unshared/validation'
import { createContext } from '../__fixtures__'

describe.concurrent<Context>('claim', () => {
  beforeEach<Context>(async(context) => {
    context.ctx = await createContext()
    await context.ctx.createServer()
  })

  afterEach<Context>(async(context) => {
    await context.ctx.destroy()
  })

  describe<Context>('getToken', (it) => {
    it('should respond with status 200', async({ expect, ctx }) => {
      const response = await ctx.fetch('/claim', { method: 'POST' })
      expect(response.status).toStrictEqual(200)
      expect(response.statusText).toStrictEqual('OK')
    })

    it('should respond with the token', async({ expect, ctx }) => {
      const response = await ctx.fetch('/claim', { method: 'POST' })
      const data = await response.json() as Record<string, string>
      expect(data).toMatchObject({ token: expect.stringMatching(EXP_UUID) })
    })

    it('should set the "runnerIsClaimed" flag', async({ ctx }) => {
      await ctx.fetch('/claim', { method: 'POST' })
      expect(ctx.ModuleRunner.runnerIsClaimed).toStrictEqual(true)
    })

    it('should set the "runnerMasterAddress" property from the "X-Forwarded-For" header', async({ ctx }) => {
      ctx.ModuleRunner.runnerTrustProxy = true
      await ctx.fetch('/claim', { method: 'POST', headers: { 'X-Forwarded-For': '0.0.0.0' } })
      expect(ctx.ModuleRunner.runnerMasterAddress).toStrictEqual('0.0.0.0')
    })

    it('should set the "runnerMasterAddress" property from the socket address', async({ ctx }) => {
      ctx.ModuleRunner.runnerTrustProxy = false
      await ctx.fetch('/claim', { method: 'POST' })
      expect(ctx.ModuleRunner.runnerMasterAddress).toStrictEqual('127.0.0.1')
    })
  })

  describe<Context>('conflict', (it) => {
    it('should respond with status 409', async({ expect, ctx }) => {
      await ctx.fetch('/claim', { method: 'POST' })
      const response = await ctx.fetch('/claim', { method: 'POST' })
      expect(response.status).toStrictEqual(409)
      expect(response.statusText).toStrictEqual('Conflict')
    })

    it('should respond with an error message', async({ expect, ctx }) => {
      await ctx.fetch('/claim', { method: 'POST' })
      const response = await ctx.fetch('/claim', { method: 'POST' })
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
