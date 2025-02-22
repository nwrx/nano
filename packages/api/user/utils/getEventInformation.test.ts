import type { Context } from '../../__fixtures__'
import { createTestEvent, createTestPeer } from '@unserved/server'
import { createTestContext } from '../../__fixtures__'
import { getEventInformation } from './getEventInformation'

describe.concurrent('getEventInformation', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
  })

  describe<Context>('with Event', (it) => {
    it('should get the address from the X-Forwarded-For header when `userTrustProxy` is true', ({ moduleUser }) => {
      const event = createTestEvent({ headers: { 'x-forwarded-for': '127.0.0.1' } })
      const result = getEventInformation.call(moduleUser, event)
      expect(result.address).toStrictEqual('127.0.0.1')
    })

    it('should get the address from the remote address when `userTrustProxy` is false', ({ moduleUser }) => {
      const event = createTestEvent({ remoteAddress: '127.0.0.1' })
      const result = getEventInformation.call(moduleUser, event)
      expect(result.address).toStrictEqual('127.0.0.1')
    })

    it('should get both session ID and token from cookies', ({ moduleUser }) => {
      const event = createTestEvent({ headers: { cookie: '__Host-Session-Id=id123;__Host-Session-Token=token123' } })
      const result = getEventInformation.call(moduleUser, event)
      expect(result.sessionId).toStrictEqual('id123')
      expect(result.sessionToken).toStrictEqual('token123')
    })

    it('should handle whitespace in cookies', ({ moduleUser }) => {
      const event = createTestEvent({ headers: { cookie: ' __Host-Session-Id = id123 ; __Host-Session-Token = token123 ' } })
      const result = getEventInformation.call(moduleUser, event)
      expect(result.sessionId).toStrictEqual('id123')
      expect(result.sessionToken).toStrictEqual('token123')
    })

    it('should get the user agent from the User-Agent header', ({ moduleUser }) => {
      const event = createTestEvent({ headers: { 'user-agent': 'user-agent' } })
      const result = getEventInformation.call(moduleUser, event)
      expect(result.userAgent).toStrictEqual('user-agent')
    })

    it('should return all the information when provided', ({ moduleUser }) => {
      const event = createTestEvent({
        headers: {
          'x-forwarded-for': '127.0.0.1',
          'cookie': '__Host-Session-Id=id123;__Host-Session-Token=token123',
          'user-agent': 'user-agent',
        },
      })
      const result = getEventInformation.call(moduleUser, event)
      expect(result).toMatchObject({
        address: '127.0.0.1',
        sessionId: 'id123',
        sessionToken: 'token123',
        userAgent: 'user-agent',
      })
    })

    it('should return all the information when not provided', ({ moduleUser }) => {
      const event = createTestEvent()
      const result = getEventInformation.call(moduleUser, event)
      expect(result).toMatchObject({
        address: '127.0.0.1',
        sessionId: undefined,
        sessionToken: undefined,
        userAgent: undefined,
      })
    })
  })

  describe<Context>('with Peer', (it) => {
    it('should get the address from the X-Forwarded-For header when `userTrustProxy` is true', ({ moduleUser }) => {
      const peer = createTestPeer({ headers: { 'x-forwarded-for': '127.0.0.1' } })
      const result = getEventInformation.call(moduleUser, peer)
      expect(result.address).toStrictEqual('127.0.0.1')
    })

    it('should get the address from the remote address when `userTrustProxy` is false', ({ moduleUser }) => {
      const peer = createTestPeer({ remoteAddress: '127.0.0.1' })
      const result = getEventInformation.call(moduleUser, peer)
      expect(result.address).toStrictEqual('127.0.0.1')
    })

    it('should get both session ID and token from cookies', ({ moduleUser }) => {
      const peer = createTestPeer({ headers: { cookie: '__Host-Session-Id=id123;__Host-Session-Token=token123' } })
      const result = getEventInformation.call(moduleUser, peer)
      expect(result.sessionId).toStrictEqual('id123')
      expect(result.sessionToken).toStrictEqual('token123')
    })

    it('should handle whitespace in cookies', ({ moduleUser }) => {
      const peer = createTestPeer({ headers: { cookie: ' __Host-Session-Id = id123 ; __Host-Session-Token = token123 ' } })
      const result = getEventInformation.call(moduleUser, peer)
      expect(result.sessionId).toStrictEqual('id123')
      expect(result.sessionToken).toStrictEqual('token123')
    })

    it('should get the user agent from the User-Agent header', ({ moduleUser }) => {
      const peer = createTestPeer({ headers: { 'user-agent': 'user-agent' } })
      const result = getEventInformation.call(moduleUser, peer)
      expect(result.userAgent).toStrictEqual('user-agent')
    })

    it('should return all the information when provided', ({ moduleUser }) => {
      const peer = createTestPeer({
        headers: {
          'x-forwarded-for': '127.0.0.1',
          'cookie': '__Host-Session-Id=id123;__Host-Session-Token=token123',
          'user-agent': 'user-agent',
        },
      })
      const result = getEventInformation.call(moduleUser, peer)
      expect(result).toMatchObject({
        address: '127.0.0.1',
        sessionId: 'id123',
        sessionToken: 'token123',
        userAgent: 'user-agent',
      })
    })

    it('should return all the information when not provided', ({ moduleUser }) => {
      const peer = createTestPeer()
      const result = getEventInformation.call(moduleUser, peer)
      expect(result).toMatchObject({
        address: '127.0.0.1',
        sessionId: undefined,
        sessionToken: undefined,
        userAgent: undefined,
      })
    })
  })
})
