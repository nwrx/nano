import { createTestEvent, createTestPeer } from '@unserved/server'
import { getEventInformation } from './getEventInformation'

describe('getEventInformation', () => {
  describe('with H3Event', () => {
    it('should get the address from the X-Forwarded-For header when `userTrustProxy` is true', () => {
      const event = createTestEvent({ headers: { 'x-forwarded-for': '127.0.0.1' } })
      const result = getEventInformation(event, { trustProxy: true, cookieName: 'token' })
      expect(result.address).toStrictEqual('127.0.0.1')
    })

    it('should get the address from the remote address when `userTrustProxy` is false', () => {
      const event = createTestEvent({ remoteAddress: '127.0.0.1' })
      const result = getEventInformation(event, { trustProxy: false, cookieName: 'token' })
      expect(result.address).toStrictEqual('127.0.0.1')
    })

    it('should get the token from the cookie', () => {
      const event = createTestEvent({ headers: { cookie: 'token=token' } })
      const result = getEventInformation(event, { trustProxy: false, cookieName: 'token' })
      expect(result.token).toStrictEqual('token')
    })

    it('should handle whitespace in the cookie', () => {
      const event = createTestEvent({ headers: { cookie: ' token = Bearer token ' } })
      const result = getEventInformation(event, { trustProxy: false, cookieName: 'token' })
      expect(result.token).toStrictEqual('Bearer token')
    })

    it('should get the user agent from the User-Agent header', () => {
      const event = createTestEvent({ headers: { 'user-agent': 'user-agent' } })
      const result = getEventInformation(event, { trustProxy: false, cookieName: 'token' })
      expect(result.userAgent).toStrictEqual('user-agent')
    })

    it('should return all the information when provided', () => {
      const event = createTestEvent({ headers: { 'x-forwarded-for': '127.0.0.1', 'cookie': 'token=token', 'user-agent': 'user-agent' } })
      const result = getEventInformation(event, { trustProxy: true, cookieName: 'token' })
      expect(result).toMatchObject({ address: '127.0.0.1', token: 'token', userAgent: 'user-agent' })
    })

    it('should return all the information when not provided', () => {
      const event = createTestEvent()
      const result = getEventInformation(event, { trustProxy: true, cookieName: 'token' })
      expect(result).toMatchObject({ address: '127.0.0.1', token: undefined, userAgent: undefined })
    })
  })

  describe('with Peer', () => {
    it('should get the address from the X-Forwarded-For header when `userTrustProxy` is true', () => {
      const peer = createTestPeer({ headers: { 'x-forwarded-for': '127.0.0.1' } })
      const result = getEventInformation(peer, { trustProxy: true, cookieName: 'token' })
      expect(result.address).toStrictEqual('127.0.0.1')
    })

    it('should get the address from the remote address when `userTrustProxy` is false', () => {
      const peer = createTestPeer({ remoteAddress: '127.0.0.1' })
      const result = getEventInformation(peer, { trustProxy: false, cookieName: 'token' })
      expect(result.address).toStrictEqual('127.0.0.1')
    })

    it('should get the token from the cookie', () => {
      const peer = createTestPeer({ headers: { cookie: 'token=token' } })
      const result = getEventInformation(peer, { trustProxy: false, cookieName: 'token' })
      expect(result.token).toStrictEqual('token')
    })

    it('should handle whitespace in the cookie', () => {
      const peer = createTestPeer({ headers: { cookie: ' token = Bearer token ' } })
      const result = getEventInformation(peer, { trustProxy: false, cookieName: 'token' })
      expect(result.token).toStrictEqual('Bearer token')
    })

    it('should get the user agent from the User-Agent header', () => {
      const peer = createTestPeer({ headers: { 'user-agent': 'user-agent' } })
      const result = getEventInformation(peer, { trustProxy: false, cookieName: 'token' })
      expect(result.userAgent).toStrictEqual('user-agent')
    })

    it('should return all the information when provided', () => {
      const event = createTestPeer({ headers: { 'x-forwarded-for': '127.0.0.1', 'cookie': 'token=token', 'user-agent': 'user-agent' } })
      const result = getEventInformation(event, { trustProxy: true, cookieName: 'token' })
      expect(result).toMatchObject({ address: '127.0.0.1', token: 'token', userAgent: 'user-agent' })
    })

    it('should return all the information when not provided', () => {
      const event = createTestPeer()
      const result = getEventInformation(event, { trustProxy: true, cookieName: 'token' })
      expect(result).toMatchObject({ address: '127.0.0.1', token: undefined, userAgent: undefined })
    })
  })
})
