/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { H3Event } from 'h3'
import type { Context } from '../../__fixtures__'
import { createTestEvent } from '@unserved/server'
import { createTestContext, FIXTURE_USER_BASIC } from '../../__fixtures__'
import { UserSession } from '../entities'
import { createSession } from './createSession'
import { createUser } from './createUser'

function getCookiesObject(event: H3Event) {
  const cookies = event.node.res.getHeader('set-cookie') as string[]
  return cookies.map((cookie) => {
    const entries = cookie.split(';').map(x => x.trim().split('=')) as Array<[string, string]>
    return Object.fromEntries(entries)
  })
}

describe.concurrent('authenticate', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
    await context.application.createTestServer()
    vi.useFakeTimers({ now: new Date('2020-01-01T00:00:00Z'), toFake: ['Date'] })
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
    vi.useRealTimers()
  })

  describe<Context>('result', (it) => {
    it('should create a UserSession instance', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      const event = createTestEvent({ headers: { 'User-Agent': 'Mozilla/5.0' } })
      const session = await createSession.call(moduleUser, event, { user, duration: 3600 })
      expect(session).toBeInstanceOf(UserSession)
    })

    it('should bind the user to the session', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      const event = createTestEvent({ headers: { 'User-Agent': 'Mozilla/5.0' } })
      const session = await createSession.call(moduleUser, event, { user, duration: 3600 })
      expect(session.user).toStrictEqual(user)
    })

    it('should store the remote address in the session', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      const event = createTestEvent({ remoteAddress: '127.0.0.1', headers: { 'User-Agent': 'Mozilla/5.0' } })
      const session = await createSession.call(moduleUser, event, { user, duration: 3600 })
      expect(session.address).toStrictEqual('127.0.0.1')
    })

    it('should store the user agent in the session', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      const event = createTestEvent({ headers: { 'User-Agent': 'Mozilla/5.0' } })
      const session = await createSession.call(moduleUser, event, { user, duration: 3600 })
      expect(session.userAgent).toStrictEqual('Mozilla/5.0')
    })

    it('should set the expiration time in the session based on the duration', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      const event = createTestEvent({ headers: { 'User-Agent': 'Mozilla/5.0' } })
      const session = await createSession.call(moduleUser, event, { user, duration: 3600 })
      const expected = new Date('2020-01-01T01:00:00.000Z')
      expect(session.expiresAt).toStrictEqual(expected)
    })

    it('should set the expiration time in the session based on the default duration', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      const event = createTestEvent({ headers: { 'User-Agent': 'Mozilla/5.0' } })
      const session = await createSession.call(moduleUser, event, { user })
      const expected = new Date('2020-01-02T00:00:00.000Z')
      expect(session.expiresAt).toStrictEqual(expected)
    })

    it('should store the secret properties in the session', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      const event = createTestEvent({ headers: { 'User-Agent': 'Mozilla/5.0' } })
      const session = await createSession.call(moduleUser, event, { user, duration: 3600 })
      expect(session.secret).toStrictEqual({
        iv: expect.any(String),
        salt: expect.any(String),
        tag: expect.any(String),
        algorithm: 'aes-256-gcm',
      })
    })
  })

  describe<Context>('cookies', (it) => {
    it('should set the session ID in the response headers', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      const event = createTestEvent({ headers: { 'User-Agent': 'Mozilla/5.0' } })
      const session = await createSession.call(moduleUser, event, { user, duration: 3600 })
      const cookies = getCookiesObject(event)
      expect(cookies[0]).toStrictEqual({
        '__Host-Session-Id': session.id,
        'Path': '/',
        'Secure': undefined,
        'HttpOnly': undefined,
        'SameSite': 'Strict',
        'Expires': session.expiresAt.toUTCString(),
        'Max-Age': '3600',
      })
    })

    it('should set the session token in the response headers', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      const event = createTestEvent({ headers: { 'User-Agent': 'Mozilla/5.0' } })
      const session = await createSession.call(moduleUser, event, { user, duration: 3600 })
      const cookies = getCookiesObject(event)
      expect(cookies[1]).toStrictEqual({
        '__Host-Session-Token': expect.any(String),
        'Path': '/',
        'Secure': undefined,
        'HttpOnly': undefined,
        'SameSite': 'Strict',
        'Expires': session.expiresAt.toUTCString(),
        'Max-Age': '3600',
      })
    })
  })

  describe<Context>('database', (it) => {
    it('should save the session in the database', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      const event = createTestEvent({ headers: { 'User-Agent': 'Mozilla/5.0' } })
      const session = await createSession.call(moduleUser, event, { user, duration: 3600 })
      const { User, UserSession } = moduleUser.getRepositories()
      await User.save(user)
      await UserSession.save(session)
      const count = await UserSession.count()
      expect(count).toStrictEqual(1)
    })
  })

  describe<Context>('errors', (it) => {
    it('should throw an error if the address is missing', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      const event = createTestEvent({ headers: { 'User-Agent': 'Mozilla/5.0' }, remoteAddress: '' })
      const shouldReject = createSession.call(moduleUser, event, { user, duration: 3600 })
      const error = moduleUser.errors.USER_ADDRESS_NOT_RESOLVED()
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw an error if the user agent is missing', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      const event = createTestEvent({ headers: {} })
      const shouldReject = createSession.call(moduleUser, event, { user, duration: 3600 })
      const error = moduleUser.errors.USER_MISSING_USER_AGENT_HEADER()
      await expect(shouldReject).rejects.toThrow(error)
    })
  })
})
