import type { TestApplication } from '@unserved/server'
import { createTestApplication, createTestEvent, createTestPeer } from '@unserved/server'
import { ModuleRunner } from '../module'
import { getEventInformation } from './getEventInformation'

interface Context {
  application: TestApplication<ModuleRunner>
  moduleRunner: ModuleRunner
}

describe.concurrent<Context>('getEventInformation', () => {
  beforeEach<Context>(async(context) => {
    context.application = await createTestApplication([ModuleRunner])
    context.moduleRunner = context.application.getModule(ModuleRunner)
    await context.application.createTestServer()
  })

  afterEach<Context>(async({ application }) => {
    await application.destroy()
  })

  describe<Context>('with H3Event', (it) => {
    it('should get the address from the X-Forwarded-For header when `runnerTrustProxy` is true', ({ expect, moduleRunner }) => {
      moduleRunner.runnerTrustProxy = true
      const event = createTestEvent({ headers: { 'x-forwarded-for': '127.0.0.1', 'authorization': 'Bearer token' } })
      const result = getEventInformation.call(moduleRunner, event)
      expect(result.address).toStrictEqual('127.0.0.1')
    })

    it('should get the address from the remote address when `runnerTrustProxy` is false', ({ expect, moduleRunner }) => {
      const event = createTestEvent({ remoteAddress: '127.0.0.1', headers: { authorization: 'Bearer token' } })
      const result = getEventInformation.call(moduleRunner, event)
      expect(result.address).toStrictEqual('127.0.0.1')
    })

    it('should get the token from the Authorization header', ({ expect, moduleRunner }) => {
      const event = createTestEvent({ headers: { authorization: 'Bearer token' } })
      const result = getEventInformation.call(moduleRunner, event)
      expect(result.token).toStrictEqual('token')
    })

    it('should handle whitespace in Authorization header', ({ expect, moduleRunner }) => {
      const event = createTestEvent({ headers: { authorization: 'Bearer   token' } })
      const result = getEventInformation.call(moduleRunner, event)
      expect(result.token).toStrictEqual('token')
    })

    it('should throw if the Authorization header is missing', ({ expect, moduleRunner }) => {
      const event = createTestEvent({ headers: {} })
      const shouldThrow = () => getEventInformation.call(moduleRunner, event)
      const error = moduleRunner.errors.NOT_AUTHORIZED()
      expect(shouldThrow).toThrow(error)
    })

    it('should return all the information', ({ expect, moduleRunner }) => {
      const event = createTestEvent({ remoteAddress: '127.0.0.1', headers: { authorization: 'Bearer token' } })
      const result = getEventInformation.call(moduleRunner, event)
      expect(result).toMatchObject({ address: '127.0.0.1', token: 'token' })
    })
  })

  describe<Context>('with Peer', (it) => {
    it('should get the address from the X-Forwarded-For header when `runnerTrustProxy` is true', ({ expect, moduleRunner }) => {
      moduleRunner.runnerTrustProxy = true
      const peer = createTestPeer({ headers: { 'x-forwarded-for': '127.0.0.1', 'authorization': 'Bearer token' } })
      const result = getEventInformation.call(moduleRunner, peer)
      expect(result.address).toStrictEqual('127.0.0.1')
    })

    it('should get the address from the remote address when `runnerTrustProxy` is false', ({ expect, moduleRunner }) => {
      const peer = createTestPeer({ remoteAddress: '127.0.0.1', headers: { authorization: 'Bearer token' } })
      const result = getEventInformation.call(moduleRunner, peer)
      expect(result.address).toStrictEqual('127.0.0.1')
    })

    it('should get the token from the Authorization header', ({ expect, moduleRunner }) => {
      const peer = createTestPeer({ headers: { authorization: 'Bearer token' } })
      const result = getEventInformation.call(moduleRunner, peer)
      expect(result.token).toStrictEqual('token')
    })

    it('should handle whitespace in the Authorization header', ({ expect, moduleRunner }) => {
      const peer = createTestPeer({ headers: { authorization: 'Bearer   token' } })
      const result = getEventInformation.call(moduleRunner, peer)
      expect(result.token).toStrictEqual('token')
    })

    it('should throw if the Authorization header is missing', ({ expect, moduleRunner }) => {
      const peer = createTestPeer({ headers: {} })
      const shouldThrow = () => getEventInformation.call(moduleRunner, peer)
      const error = moduleRunner.errors.NOT_AUTHORIZED()
      expect(shouldThrow).toThrow(error)
    })

    it('should return all the information', ({ expect, moduleRunner }) => {
      const peer = createTestPeer({ remoteAddress: '127.0.0.1', headers: { authorization: 'Bearer token' } })
      const result = getEventInformation.call(moduleRunner, peer)
      expect(result).toMatchObject({ address: '127.0.0.1', token: 'token' })
    })
  })
})
