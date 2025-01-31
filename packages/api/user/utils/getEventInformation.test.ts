import { createEvent, createPeer } from '../../__fixtures__'
import { getEventInformation } from './getEventInformation'

describe('getEventInformation', () => {
  describe('with H3Event', () => {
    it('should get the address from the X-Forwarded-For header when `userTrustProxy` is true', () => {
      const event = createEvent({ headers: { 'x-forwarded-for': '127.0.0.1' } })
      // @ts-expect-error: The `this` context is not important for this test.
      const result = getEventInformation.call({ userTrustProxy: true }, event)
      expect(result.address).toStrictEqual('127.0.0.1')
    })

    it('should get the address from the remote address when `userTrustProxy` is false', () => {
      const event = createEvent({ remoteAddress: '127.0.0.1' })
      // @ts-expect-error: The `this` context is not important for this test.
      const result = getEventInformation.call({ userTrustProxy: false }, event)
      expect(result.address).toStrictEqual('127.0.0.1')
    })

    it('should get the token from the cookie', () => {
      const event = createEvent({ headers: { cookie: 'token=token' } })
      // @ts-expect-error: The `this` context is not important for this test.
      const result = getEventInformation.call({ userSessionCookieName: 'token' }, event)
      expect(result.token).toStrictEqual('token')
    })

    it('should handle whitespace in the cookie', () => {
      const event = createEvent({ headers: { cookie: ' token = Bearer token ' } })
      // @ts-expect-error: The `this` context is not important for this test.
      const result = getEventInformation.call({ userSessionCookieName: 'token' }, event)
      expect(result.token).toStrictEqual('Bearer token')
    })

    it('should get the user agent from the User-Agent header', () => {
      const event = createEvent({ headers: { 'user-agent': 'user-agent' } })
      // @ts-expect-error: The `this` context is not important for this test.
      const result = getEventInformation.call({}, event)
      expect(result.userAgent).toStrictEqual('user-agent')
    })

    it('should return all the information', () => {
      const event = createEvent({ headers: { 'x-forwarded-for': '127.0.0.1', 'cookie': 'token=token', 'user-agent': 'user-agent' } })
      // @ts-expect-error: The `this` context is not important for this test.
      const result = getEventInformation.call({ userTrustProxy: true, userSessionCookieName: 'token' }, event)
      expect(result).toMatchObject({ address: '127.0.0.1', token: 'token', userAgent: 'user-agent' })
    })
  })

  describe('with Peer', () => {
    it('should get the address from the X-Forwarded-For header when `userTrustProxy` is true', () => {
      const peer = createPeer({ headers: { 'x-forwarded-for': '127.0.0.1' } })
      // @ts-expect-error: The `this` context is not important for this test.
      const result = getEventInformation.call({ userTrustProxy: true }, peer)
      expect(result.address).toStrictEqual('127.0.0.1')
    })

    it('should get the address from the remote address when `userTrustProxy` is false', () => {
      const peer = createPeer({ remoteAddress: '127.0.0.1' })
      // @ts-expect-error: The `this` context is not important for this test.
      const result = getEventInformation.call({ userTrustProxy: false }, peer)
      expect(result.address).toStrictEqual('127.0.0.1')
    })

    it('should get the token from the cookie', () => {
      const peer = createPeer({ headers: { cookie: 'token=token' } })
      // @ts-expect-error: The `this` context is not important for this test.
      const result = getEventInformation.call({ userSessionCookieName: 'token' }, peer)
      expect(result.token).toStrictEqual('token')
    })

    it('should handle whitespace in the cookie', () => {
      const peer = createPeer({ headers: { cookie: ' token = Bearer token ' } })
      // @ts-expect-error: The `this` context is not important for this test.
      const result = getEventInformation.call({ userSessionCookieName: 'token' }, peer)
      expect(result.token).toStrictEqual('Bearer token')
    })

    it('should get the user agent from the User-Agent header', () => {
      const peer = createPeer({ headers: { 'user-agent': 'user-agent' } })
      // @ts-expect-error: The `this` context is not important for this test.
      const result = getEventInformation.call({}, peer)
      expect(result.userAgent).toStrictEqual('user-agent')
    })

    it('should return all the information', () => {
      const event = createPeer({ headers: { 'x-forwarded-for': '127.0.0.1', 'cookie': 'token=token', 'user-agent': 'user-agent' } })
      // @ts-expect-error: The `this` context is not important for this test.
      const result = getEventInformation.call({ userTrustProxy: true, userSessionCookieName: 'token' }, event)
      expect(result).toMatchObject({ address: '127.0.0.1', token: 'token', userAgent: 'user-agent' })
    })
  })
})
