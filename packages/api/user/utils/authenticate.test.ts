import type { Context } from '../../__fixtures__'
import { createTestEvent, createTestPeer } from '@unserved/server'
import { randomBytes } from 'node:crypto'
import { createTestContext } from '../../__fixtures__'
import { User, UserSession } from '../entities'
import { authenticate } from './authenticate'

describe.concurrent('authenticate', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
    await context.application.createTestServer()
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  for (const [createEvent, name] of [[createTestEvent, 'H3Event'], [createTestPeer, 'Peer']] as const) {
    describe(`with ${name}`, () => {
      describe<Context>('authenticate', (it) => {
        it('should return a UserSession instance', async({ moduleUser, createUser }) => {
          const { headers } = await createUser()
          const peer = createEvent({ headers })
          const result = await authenticate.call(moduleUser, peer, {})
          expect(result).toBeInstanceOf(UserSession)
        })

        it('should load the "user" relation', async({ moduleUser, createUser }) => {
          const { headers } = await createUser()
          const peer = createEvent({ headers })
          const result = await authenticate.call(moduleUser, peer, {})
          expect(result.user).toBeInstanceOf(User)
        })

        it('should authenticate when the token is valid', async({ moduleUser, createUser }) => {
          const { headers, session } = await createUser()
          const peer = createEvent({ headers })
          const result = await authenticate.call(moduleUser, peer, {})
          expect(result.id).toStrictEqual(session.id)
        })

        it('should authenticate when no token is provided and "optional" is true', async({ moduleUser }) => {
          const peer = createEvent()
          const result = await authenticate.call(moduleUser, peer, { optional: true })
          expect(result).toStrictEqual({})
        })
      })

      describe<Context>('error', () => {
        for (const optional of [false, true]) {
          describe<Context>(`when "optional" option is "${optional}"`, (it) => {
            if (optional) {
              it('should return empty object when token is not provided', async({ moduleUser }) => {
                const peer = createEvent()
                const result = await authenticate.call(moduleUser, peer, { optional })
                expect(result).toStrictEqual({})
              })

              it('should return empty object when address is not resolved', async({ moduleUser, createUser }) => {
                const { headers } = await createUser()
                const peer = createEvent({ headers, remoteAddress: '' })
                const result = await authenticate.call(moduleUser, peer, { optional })
                expect(result).toStrictEqual({})
              })

              it('should return empty object when user agent is not provided', async({ moduleUser }) => {
                const token = randomBytes(32).toString('hex')
                const headers = { cookie: `${moduleUser.userSessionCookieName}=${token}` }
                const peer = createEvent({ headers })
                const result = await authenticate.call(moduleUser, peer, { optional })
                expect(result).toStrictEqual({})
              })
            }

            else {
              it('should throw when token is not provided', async({ moduleUser }) => {
                const peer = createEvent()
                const shouldReject = authenticate.call(moduleUser, peer, { optional })
                const error = moduleUser.errors.USER_NOT_AUTHENTICATED()
                await expect(shouldReject).rejects.toThrow(error)
              })

              it('should throw when address is not resolved', async({ moduleUser, createUser }) => {
                const { headers } = await createUser()
                const peer = createEvent({ headers, remoteAddress: '' })
                const shouldReject = authenticate.call(moduleUser, peer, { optional })
                const error = moduleUser.errors.USER_ADDRESS_NOT_RESOLVED()
                await expect(shouldReject).rejects.toThrow(error)
              })

              it('should throw when user agent is not provided', async({ moduleUser }) => {
                const token = randomBytes(32).toString('hex')
                const headers = { cookie: `${moduleUser.userSessionCookieName}=${token}` }
                const peer = createEvent({ headers })
                const shouldReject = authenticate.call(moduleUser, peer, { optional })
                const error = moduleUser.errors.USER_MISSING_USER_AGENT_HEADER()
                await expect(shouldReject).rejects.toThrow(error)
              })
            }

            it('should throw when the token is invalid', async({ moduleUser }) => {
              const token = randomBytes(32).toString('hex')
              const headers = { 'cookie': `${moduleUser.userSessionCookieName}=${token}`, 'user-agent': 'Mozilla/5.0' }
              const peer = createEvent({ headers })
              const shouldReject = authenticate.call(moduleUser, peer, { optional })
              const error = moduleUser.errors.USER_SESSION_NOT_FOUND()
              await expect(shouldReject).rejects.toThrow(error)
            })

            it('should throw when the user session is deleted', async({ moduleUser, createUser }) => {
              const { headers, session } = await createUser()
              await moduleUser.getRepositories().UserSession.softRemove(session)
              const peer = createEvent({ headers })
              const shouldReject = authenticate.call(moduleUser, peer, { optional })
              const error = moduleUser.errors.USER_SESSION_NOT_FOUND()
              await expect(shouldReject).rejects.toThrow(error)
            })

            it('should throw when the user is deleted', async({ moduleUser, createUser }) => {
              const { headers, session } = await createUser()
              await moduleUser.getRepositories().User.softRemove(session.user!)
              const peer = createEvent({ headers })
              const shouldReject = authenticate.call(moduleUser, peer, { optional })
              const error = moduleUser.errors.USER_SESSION_NOT_FOUND()
              await expect(shouldReject).rejects.toThrow(error)
            })

            it('should throw when the user is disabled', async({ moduleUser, createUser }) => {
              const { headers, session } = await createUser()
              session.user!.disabledAt = new Date()
              await moduleUser.getRepositories().User.save(session.user!)
              const peer = createEvent({ headers })
              const shouldReject = authenticate.call(moduleUser, peer, { optional })
              const error = moduleUser.errors.USER_SESSION_NOT_FOUND()
              await expect(shouldReject).rejects.toThrow(error)
            })

            it('should throw when the address is different', async({ moduleUser, createUser }) => {
              const { headers } = await createUser()
              const peer = createEvent({ headers, remoteAddress: '0.0.0.0' })
              const shouldReject = authenticate.call(moduleUser, peer, { optional })
              const error = moduleUser.errors.USER_SESSION_NOT_FOUND()
              await expect(shouldReject).rejects.toThrow(error)
            })

            it('should throw when the user agent is different', async({ moduleUser, createUser }) => {
              const { headers } = await createUser()
              headers['user-agent'] = 'Not-Mozilla/5.0'
              const peer = createEvent({ headers })
              const shouldReject = authenticate.call(moduleUser, peer, { optional })
              const error = moduleUser.errors.USER_SESSION_NOT_FOUND()
              await expect(shouldReject).rejects.toThrow(error)
            })

            it('should throw when the token is expired', async({ moduleUser, createUser }) => {
              const { headers, session } = await createUser()
              session.expiresAt = new Date(Date.now() - 1000)
              await moduleUser.getRepositories().UserSession.save(session)
              const peer = createEvent({ headers })
              const shouldReject = authenticate.call(moduleUser, peer, { optional })
              const error = moduleUser.errors.USER_SESSION_EXPIRED()
              await expect(shouldReject).rejects.toThrow(error)
            })
          })
        }
      })
    })
  }
}, 1000)
