import type { Context } from '../__fixtures__'
import { createContext, createEvent, createPeer } from '../__fixtures__'
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
    it('should authorize the event when the token and address are valid with "runnerTrustProxy" set to true', ({ ctx }) => {
      ctx.ModuleRunner.runnerTrustProxy = true
      const event = createEvent({
        headers: {
          'authorization': `Bearer ${ctx.ModuleRunner.runnerToken}`,
          'x-forwarded-for': ctx.ModuleRunner.runnerMasterAddress,
        },
      })
      const result = authorize.call(ctx.ModuleRunner, event)
      expect(result).toBeUndefined()
    })

    it('should authorize the event when the token and address are valid with "runnerTrustProxy" set to false', ({ ctx }) => {
      const event = createEvent({
        headers: { authorization: `Bearer ${ctx.ModuleRunner.runnerToken}` },
        remoteAddress: ctx.ModuleRunner.runnerMasterAddress,
      })
      const result = authorize.call(ctx.ModuleRunner, event)
      expect(result).toBeUndefined()
    })

    it('should throw an error when the token is invalid', ({ ctx }) => {
      const event = createEvent({
        headers: { authorization: 'Bearer invalid' },
        remoteAddress: ctx.ModuleRunner.runnerMasterAddress,
      })
      const shouldThrow = () => authorize.call(ctx.ModuleRunner, event)
      const error = ctx.ModuleRunner.errors.NOT_AUTHORIZED()
      expect(shouldThrow).toThrowError(error)
    })

    it('should throw an error when the address is invalid', ({ ctx }) => {
      const event = createEvent({
        headers: { authorization: `Bearer ${ctx.ModuleRunner.runnerToken}` },
        remoteAddress: '0.0.0.0',
      })
      const shouldThrow = () => authorize.call(ctx.ModuleRunner, event)
      const error = ctx.ModuleRunner.errors.NOT_AUTHORIZED()
      expect(shouldThrow).toThrowError(error)
    })
  })

  describe<Context>('with peer', (it) => {
    it('should authorize the peer when the token and address are valid with "runnerTrustProxy" set to true', ({ ctx }) => {
      ctx.ModuleRunner.runnerTrustProxy = true
      const peer = createPeer({
        headers: {
          'authorization': `Bearer ${ctx.ModuleRunner.runnerToken}`,
          'x-forwarded-for': ctx.ModuleRunner.runnerMasterAddress,
        },
      })
      const result = authorize.call(ctx.ModuleRunner, peer)
      expect(result).toBeUndefined()
    })

    it('should authorize the peer when the token and address are valid with "runnerTrustProxy" set to false', ({ ctx }) => {
      const peer = createPeer({
        headers: { authorization: `Bearer ${ctx.ModuleRunner.runnerToken}` },
        remoteAddress: ctx.ModuleRunner.runnerMasterAddress,
      })
      const result = authorize.call(ctx.ModuleRunner, peer)
      expect(result).toBeUndefined()
    })

    it('should throw an error when the token is invalid', ({ ctx }) => {
      const peer = createPeer({
        headers: { authorization: 'Bearer invalid' },
        remoteAddress: ctx.ModuleRunner.runnerMasterAddress,
      })
      const shouldThrow = () => authorize.call(ctx.ModuleRunner, peer)
      const error = ctx.ModuleRunner.errors.NOT_AUTHORIZED()
      expect(shouldThrow).toThrowError(error)
    })

    it('should throw an error when the address is invalid', ({ ctx }) => {
      const peer = createPeer({
        headers: { authorization: `Bearer ${ctx.ModuleRunner.runnerToken}` },
        remoteAddress: '0.0.0.0',
      })
      const shouldThrow = () => authorize.call(ctx.ModuleRunner, peer)
      const error = ctx.ModuleRunner.errors.NOT_AUTHORIZED()
      expect(shouldThrow).toThrowError(error)
    })
  })
})
