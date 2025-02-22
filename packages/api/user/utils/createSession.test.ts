import type { Context } from '../../__fixtures__'
import { createTestEvent } from '@unserved/server'
import { createTestContext, FIXTURE_USER_BASIC } from '../../__fixtures__'
import { UserSession } from '../entities'
import { createSession } from './createSession'
import { createUser } from './createUser'

describe.concurrent('authenticate', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
    await context.application.createTestServer()
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  describe<Context>('result', (it) => {
    it('should create a UserSession instance', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      const event = createTestEvent({ headers: { 'User-Agent': 'Mozilla/5.0' } })
      const session = createSession.call(moduleUser, event, { user, duration: 3600 })
      expect(session).toBeInstanceOf(UserSession)
    })

    it('should bind the user to the session', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      const event = createTestEvent({ headers: { 'User-Agent': 'Mozilla/5.0' } })
      const session = createSession.call(moduleUser, event, { user, duration: 3600 })
      expect(session.user).toStrictEqual(user)
    })

    it('should store the remote address in the session', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      const event = createTestEvent({ remoteAddress: '127.0.0.1', headers: { 'User-Agent': 'Mozilla/5.0' } })
      const session = createSession.call(moduleUser, event, { user, duration: 3600 })
      expect(session.address).toStrictEqual('127.0.0.1')
    })

    it('should store the user agent in the session', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      const event = createTestEvent({ headers: { 'User-Agent': 'Mozilla/5.0' } })
      const session = createSession.call(moduleUser, event, { user, duration: 3600 })
      expect(session.userAgent).toStrictEqual('Mozilla/5.0')
    })

    it('should set the expiration time in the session based on the duration', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      vi.useFakeTimers({ now: new Date('2020-01-01T00:00:00Z'), toFake: ['Date'] })
      const event = createTestEvent({ headers: { 'User-Agent': 'Mozilla/5.0' } })
      const session = createSession.call(moduleUser, event, { user, duration: 3600 })
      const expected = new Date('2020-01-01T00:00:03.600Z')
      expect(session.expiresAt).toStrictEqual(expected)
      vi.useRealTimers()
    })

    it('should set the expiration time in the session based on the default duration', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      vi.useFakeTimers({ now: new Date('2020-01-01T00:00:00Z'), toFake: ['Date'] })
      const event = createTestEvent({ headers: { 'User-Agent': 'Mozilla/5.0' } })
      const session = createSession.call(moduleUser, event, { user })
      const expected = new Date('2020-01-02T00:00:00.000Z')
      expect(session.expiresAt).toStrictEqual(expected)
      vi.useRealTimers()
    })
  })

  describe<Context>('database', (it) => {
    it('should save the session in the database', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      const event = createTestEvent({ headers: { 'User-Agent': 'Mozilla/5.0' } })
      const session = createSession.call(moduleUser, event, { user, duration: 3600 })
      const { User, UserSession } = moduleUser.getRepositories()
      await User.save(user)
      await UserSession.save(session)
      const count = await UserSession.countBy({ user })
      expect(count).toStrictEqual(1)
    })
  })

  describe<Context>('errors', (it) => {
    it('should throw an error if the address is missing', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      const event = createTestEvent({ remoteAddress: '', headers: { 'User-Agent': 'Mozilla/5.0' } })
      const shouldThrow = () => createSession.call(moduleUser, event, { user, duration: 3600 })
      const error = moduleUser.errors.USER_ADDRESS_NOT_RESOLVED()
      expect(shouldThrow).toThrow(error)
    })

    it('should throw an error if the user agent is missing', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      const event = createTestEvent()
      const shouldThrow = () => createSession.call(moduleUser, event, { user, duration: 3600 })
      const error = moduleUser.errors.USER_MISSING_USER_AGENT_HEADER()
      expect(shouldThrow).toThrow(error)
    })
  })
})
