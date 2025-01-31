import type { Context } from '../__fixtures__'
import { createContext, createEvent } from '../__fixtures__'
import { authorize } from './authorize'

describe.concurrent<Context>('authorize', () => {
  beforeEach<Context>(async(context) => {
    context.ctx = await createContext()
    await context.ctx.createServer()
  })

  afterEach<Context>(async(context) => {
    await context.ctx.destroy()
  })

  describe<Context>('with event', (it) => {
    it('should authorize the event', ({ expect, ctx }) => {
      ctx.ModuleRunner.runnerTrustProxy = true
      const event = createEvent({
        remoteAddress: ctx.ModuleRunner.runnerMasterAddress,
        headers: {
          'Authorization': `Bearer ${ctx.ModuleRunner.runnerToken}`,
          'X-Forwarded-For': ctx.ModuleRunner.runnerMasterAddress,
        },
      })
      const result = authorize.call(ctx.ModuleRunner, event)
      expect(result).toStrictEqual(undefined)
    })
  })
})
