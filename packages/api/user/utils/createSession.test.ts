import type { Context } from '../../__fixtures__'
import { createTestEvent } from '@unserved/server'
import { createTestContext } from '../../__fixtures__'
import { UserSession } from '../entities'
import { createSession } from './createSession'

describe.concurrent('authenticate', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
    await context.application.createTestServer()
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  describe<Context>('createSession', (it) => {
    it('should create a UserSession instance', ({ moduleUser }) => {
      const { User } = moduleUser.getRepositories()
      const user = User.create()
      const event = createTestEvent({ headers: { 'User-Agent': 'Mozilla/5.0' } })
      const session = createSession.call(moduleUser, event, { user, duration: 3600 })
      expect(session).toBeInstanceOf(UserSession)
    })

    it('should bind the user to the session', ({ moduleUser }) => {
      const { User } = moduleUser.getRepositories()
      const user = User.create()
      const event = createTestEvent({ headers: { 'User-Agent': 'Mozilla/5.0' } })
      const session = createSession.call(moduleUser, event, { user, duration: 3600 })
      expect(session.user).toStrictEqual(user)
    })

    it('should store the remote address in the session', ({ moduleUser }) => {
      const { User } = moduleUser.getRepositories()
      const user = User.create()
      const event = createTestEvent({ remoteAddress: '127.0.0.1', headers: { 'User-Agent': 'Mozilla/5.0' } })
      const session = createSession.call(moduleUser, event, { user, duration: 3600 })
      expect(session.address).toStrictEqual('127.0.0.1')
    })

    it('should store the user agent in the session', ({ moduleUser }) => {
      const { User } = moduleUser.getRepositories()
      const user = User.create()
      const event = createTestEvent({ headers: { 'User-Agent': 'Mozilla/5.0' } })
      const session = createSession.call(moduleUser, event, { user, duration: 3600 })
      expect(session.userAgent).toStrictEqual('Mozilla/5.0')
    })

    it('should set the expiration time in the session based on the duration', ({ moduleUser }) => {
      vi.useFakeTimers({ now: new Date('2020-01-01T00:00:00Z'), toFake: ['Date'] })
      const { User } = moduleUser.getRepositories()
      const user = User.create()
      const event = createTestEvent({ headers: { 'User-Agent': 'Mozilla/5.0' } })
      const session = createSession.call(moduleUser, event, { user, duration: 3600 })
      const expected = new Date('2020-01-01T00:00:03.600Z')
      expect(session.expiresAt).toStrictEqual(expected)
      vi.useRealTimers()
    })

    it('should set the expiration time in the session based on the default duration', ({ moduleUser }) => {
      vi.useFakeTimers({ now: new Date('2020-01-01T00:00:00Z'), toFake: ['Date'] })
      const { User } = moduleUser.getRepositories()
      const user = User.create()
      const event = createTestEvent({ headers: { 'User-Agent': 'Mozilla/5.0' } })
      const session = createSession.call(moduleUser, event, { user })
      const expected = new Date('2020-01-02T00:00:00.000Z')
      expect(session.expiresAt).toStrictEqual(expected)
      vi.useRealTimers()
    })
  })

  describe<Context>('errors', (it) => {
    it('should throw an error if the address is missing', ({ moduleUser }) => {
      const { User } = moduleUser.getRepositories()
      const user = User.create()
      const event = createTestEvent({ remoteAddress: '', headers: { 'User-Agent': 'Mozilla/5.0' } })
      const shouldThrow = () => createSession.call(moduleUser, event, { user, duration: 3600 })
      const error = moduleUser.errors.USER_ADDRESS_NOT_RESOLVED()
      expect(shouldThrow).toThrow(error)
    })

    it('should throw an error if the user agent is missing', ({ moduleUser }) => {
      const { User } = moduleUser.getRepositories()
      const user = User.create()
      const event = createTestEvent()
      const shouldThrow = () => createSession.call(moduleUser, event, { user, duration: 3600 })
      const error = moduleUser.errors.USER_MISSING_USER_AGENT_HEADER()
      expect(shouldThrow).toThrow(error)
    })
  })
})
