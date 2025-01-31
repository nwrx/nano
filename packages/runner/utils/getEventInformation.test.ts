import type { Context } from '../__fixtures__'
import { createContext, createEvent, createPeer } from '../__fixtures__'
import { getEventInformation } from './getEventInformation'

describe.concurrent<Context>('getEventInformation', () => {
  beforeEach<Context>(async(context) => {
    context.ctx = await createContext()
    await context.ctx.createServer()
  })

  afterEach<Context>(async(context) => {
    await context.ctx.destroy()
  })

  describe<Context>('with H3Event', (it) => {
    it('should get the address from the X-Forwarded-For header when `runnerTrustProxy` is true', ({ ctx, expect }) => {
      ctx.ModuleRunner.runnerTrustProxy = true
      const event = createEvent({ headers: { 'x-forwarded-for': '127.0.0.1', 'authorization': 'Bearer token' } })
      const result = getEventInformation.call(ctx.ModuleRunner, event)
      expect(result.address).toStrictEqual('127.0.0.1')
    })

    it('should get the address from the remote address when `runnerTrustProxy` is false', ({ ctx, expect }) => {
      ctx.ModuleRunner.runnerTrustProxy = false
      const event = createEvent({ remoteAddress: '127.0.0.1', headers: { authorization: 'Bearer token' } })
      const result = getEventInformation.call(ctx.ModuleRunner, event)
      expect(result.address).toStrictEqual('127.0.0.1')
    })

    it('should get the token from the Authorization header', ({ ctx, expect }) => {
      ctx.ModuleRunner.runnerTrustProxy = false
      const event = createEvent({ headers: { authorization: 'Bearer token' } })
      const result = getEventInformation.call(ctx.ModuleRunner, event)
      expect(result.token).toStrictEqual('token')
    })

    it('should handle whitespace in Authorization header', ({ ctx, expect }) => {
      ctx.ModuleRunner.runnerTrustProxy = false
      const event = createEvent({ headers: { authorization: 'Bearer   token' } })
      const result = getEventInformation.call(ctx.ModuleRunner, event)
      expect(result.token).toStrictEqual('token')
    })

    it('should throw if the Authorization header is missing', ({ ctx, expect }) => {
      ctx.ModuleRunner.runnerTrustProxy = false
      const event = createEvent({ headers: {} })
      const shouldThrow = () => getEventInformation.call(ctx.ModuleRunner, event)
      const error = ctx.ModuleRunner.errors.NOT_AUTHORIZED()
      expect(shouldThrow).toThrow(error)
    })

    it('should return all the information', ({ ctx, expect }) => {
      ctx.ModuleRunner.runnerTrustProxy = false
      const event = createEvent({ remoteAddress: '127.0.0.1', headers: { authorization: 'Bearer token' } })
      const result = getEventInformation.call(ctx.ModuleRunner, event)
      expect(result).toMatchObject({ address: '127.0.0.1', token: 'token' })
    })
  })

  describe<Context>('with Peer', (it) => {
    it('should get the address from the X-Forwarded-For header when `runnerTrustProxy` is true', ({ ctx, expect }) => {
      ctx.ModuleRunner.runnerTrustProxy = true
      const peer = createPeer({ headers: { 'x-forwarded-for': '127.0.0.1', 'authorization': 'Bearer token' } })
      const result = getEventInformation.call(ctx.ModuleRunner, peer)
      expect(result.address).toStrictEqual('127.0.0.1')
    })

    it('should get the address from the remote address when `runnerTrustProxy` is false', ({ ctx, expect }) => {
      ctx.ModuleRunner.runnerTrustProxy = false
      const peer = createPeer({ remoteAddress: '127.0.0.1', headers: { authorization: 'Bearer token' } })
      const result = getEventInformation.call(ctx.ModuleRunner, peer)
      expect(result.address).toStrictEqual('127.0.0.1')
    })

    it('should get the token from the Authorization header', ({ ctx, expect }) => {
      ctx.ModuleRunner.runnerTrustProxy = false
      const peer = createPeer({ headers: { authorization: 'Bearer token' } })
      const result = getEventInformation.call(ctx.ModuleRunner, peer)
      expect(result.token).toStrictEqual('token')
    })

    it('should handle whitespace in the Authorization header', ({ ctx, expect }) => {
      ctx.ModuleRunner.runnerTrustProxy = false
      const peer = createPeer({ headers: { authorization: 'Bearer   token' } })
      const result = getEventInformation.call(ctx.ModuleRunner, peer)
      expect(result.token).toStrictEqual('token')
    })

    it('should throw if the Authorization header is missing', ({ ctx, expect }) => {
      ctx.ModuleRunner.runnerTrustProxy = false
      const peer = createPeer({ headers: {} })
      const shouldThrow = () => getEventInformation.call(ctx.ModuleRunner, peer)
      const error = ctx.ModuleRunner.errors.NOT_AUTHORIZED()
      expect(shouldThrow).toThrow(error)
    })

    it('should return all the information', ({ ctx, expect }) => {
      ctx.ModuleRunner.runnerTrustProxy = false
      const peer = createPeer({ remoteAddress: '127.0.0.1', headers: { authorization: 'Bearer token' } })
      const result = getEventInformation.call(ctx.ModuleRunner, peer)
      expect(result).toMatchObject({ address: '127.0.0.1', token: 'token' })
    })
  })
})
