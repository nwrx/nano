/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import { createTestEvent, createTestPeer } from '@unserved/server'
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

  const EVENT_TYPES = [
    [createTestEvent, 'H3Event'],
    [createTestPeer, 'Peer'],
  ] as const

  for (const [createEvent, name] of EVENT_TYPES) {
    describe(`with ${name}`, () => {
      describe<Context>('authenticate', (it) => {
        it('should return a UserSession instance', async({ moduleUser, setupUser }) => {
          const { headers } = await setupUser()
          const event = createEvent({ headers })
          const result = await authenticate.call(moduleUser, event)
          expect(result).toBeInstanceOf(UserSession)
        })

        it('should load the "user" relation', async({ moduleUser, setupUser }) => {
          const { headers } = await setupUser()
          const event = createEvent({ headers })
          const result = await authenticate.call(moduleUser, event)
          expect(result.user).toBeInstanceOf(User)
        })

        it('should authenticate when the token is valid', async({ moduleUser, setupUser }) => {
          const { headers } = await setupUser()
          const event = createEvent({ headers })
          const result = await authenticate.call(moduleUser, event)
          expect(result).toMatchObject({ user: expect.any(User) })
        })

        it('should authenticate when no token is provided and "optional" is true', async({ moduleUser }) => {
          const event = createEvent()
          const result = await authenticate.call(moduleUser, event, { optional: true })
          expect(result).toStrictEqual({})
        })
      })

      describe<Context>('error', () => {
        for (const optional of [false, true]) {
          describe<Context>(`when "optional" option is "${optional}"`, (it) => {
            if (optional) {
              it('should return empty object when sessionToken is not provided', async({ moduleUser, setupUser }) => {
                const { headers } = await setupUser()
                const event = createEvent({ headers: { ...headers, cookie: headers.cookie.replace(moduleUser.userSessionTokenCookieName, 'DELETE') } })
                const result = await authenticate.call(moduleUser, event, { optional })
                expect(result).toStrictEqual({})
              })

              it('should return empty object when sessionId is not provided', async({ moduleUser, setupUser }) => {
                const { headers } = await setupUser()
                const event = createEvent({ headers: { ...headers, cookie: headers.cookie.replace(moduleUser.userSessionIdCookieName, 'DELETE') } })
                const result = await authenticate.call(moduleUser, event, { optional })
                expect(result).toStrictEqual({})
              })

              it('should return empty object when address is not resolved', async({ moduleUser, setupUser }) => {
                const { headers } = await setupUser()
                const peer = createEvent({ headers, remoteAddress: '' })
                const result = await authenticate.call(moduleUser, peer, { optional })
                expect(result).toStrictEqual({})
              })

              it('should return empty object when user agent is not provided', async({ moduleUser, setupUser }) => {
                const { headers } = await setupUser()
                headers['user-agent'] = ''
                const peer = createEvent({ headers })
                const result = await authenticate.call(moduleUser, peer, { optional })
                expect(result).toStrictEqual({})
              })
            }

            else {
              it('should throw when sessionToken is not provided', async({ moduleUser, setupUser }) => {
                const { headers } = await setupUser()
                const event = createEvent({ headers: { ...headers, cookie: headers.cookie.replace(moduleUser.userSessionTokenCookieName, 'DELETE') } })
                const shouldReject = authenticate.call(moduleUser, event, { optional })
                const error = moduleUser.errors.USER_UNAUTHORIZED()
                await expect(shouldReject).rejects.toThrow(error)
              })

              it('should throw when sessionId is not provided', async({ moduleUser, setupUser }) => {
                const { headers } = await setupUser()
                const event = createEvent({ headers: { ...headers, cookie: headers.cookie.replace(moduleUser.userSessionIdCookieName, 'DELETE') } })
                const shouldReject = authenticate.call(moduleUser, event, { optional })
                const error = moduleUser.errors.USER_UNAUTHORIZED()
                await expect(shouldReject).rejects.toThrow(error)
              })

              it('should throw when address is not resolved', async({ moduleUser, setupUser }) => {
                const { headers } = await setupUser()
                const peer = createEvent({ headers, remoteAddress: '' })
                const shouldReject = authenticate.call(moduleUser, peer, { optional })
                const error = moduleUser.errors.USER_ADDRESS_NOT_RESOLVED()
                await expect(shouldReject).rejects.toThrow(error)
              })

              it('should throw when user agent is not provided', async({ moduleUser, setupUser }) => {
                const { headers } = await setupUser()
                headers['user-agent'] = ''
                const peer = createEvent({ headers })
                const shouldReject = authenticate.call(moduleUser, peer, { optional })
                const error = moduleUser.errors.USER_MISSING_USER_AGENT_HEADER()
                await expect(shouldReject).rejects.toThrow(error)
              })
            }

            it('should throw when the sessionToken is invalid', async({ moduleUser, setupUser }) => {
              const { headers } = await setupUser()
              headers.cookie = headers.cookie.replace(`${moduleUser.userSessionTokenCookieName}=`, `${moduleUser.userSessionTokenCookieName}=00`)
              const event = createEvent({ headers })
              const shouldReject = authenticate.call(moduleUser, event, { optional })
              const error = moduleUser.errors.USER_SESSION_NOT_FOUND()
              await expect(shouldReject).rejects.toThrow(error)
            })

            it('should throw when the user session is deleted', async({ moduleUser, setupUser }) => {
              const { headers, session } = await setupUser()
              await moduleUser.getRepositories().UserSession.softRemove(session)
              const event = createEvent({ headers })
              const shouldReject = authenticate.call(moduleUser, event, { optional })
              const error = moduleUser.errors.USER_SESSION_NOT_FOUND()
              await expect(shouldReject).rejects.toThrow(error)
            })

            it('should throw when the user is deleted', async({ moduleUser, setupUser }) => {
              const { headers, session } = await setupUser()
              await moduleUser.getRepositories().User.softRemove(session.user!)
              const event = createEvent({ headers })
              const shouldReject = authenticate.call(moduleUser, event, { optional })
              const error = moduleUser.errors.USER_SESSION_NOT_FOUND()
              await expect(shouldReject).rejects.toThrow(error)
            })

            it('should throw when the user is disabled', async({ moduleUser, setupUser }) => {
              const { headers, session } = await setupUser()
              session.user!.disabledAt = new Date()
              await moduleUser.getRepositories().User.save(session.user!)
              const event = createEvent({ headers })
              const shouldReject = authenticate.call(moduleUser, event, { optional })
              const error = moduleUser.errors.USER_SESSION_NOT_FOUND()
              await expect(shouldReject).rejects.toThrow(error)
            })

            it('should throw when the address is different', async({ moduleUser, setupUser }) => {
              const { headers } = await setupUser()
              const event = createEvent({ headers, remoteAddress: '0.0.0.0' })
              const shouldReject = authenticate.call(moduleUser, event, { optional })
              const error = moduleUser.errors.USER_SESSION_NOT_FOUND()
              await expect(shouldReject).rejects.toThrow(error)
            })

            it('should throw when the user agent is different', async({ moduleUser, setupUser }) => {
              const { headers } = await setupUser()
              headers['user-agent'] = 'Not-Mozilla/5.0'
              const event = createEvent({ headers })
              const shouldReject = authenticate.call(moduleUser, event, { optional })
              const error = moduleUser.errors.USER_SESSION_NOT_FOUND()
              await expect(shouldReject).rejects.toThrow(error)
            })

            it('should throw when the token is expired', async({ moduleUser, setupUser }) => {
              const { headers, session } = await setupUser()
              session.expiresAt = new Date(Date.now() - 1000)
              await moduleUser.getRepositories().UserSession.save(session)
              const event = createEvent({ headers })
              const shouldReject = authenticate.call(moduleUser, event, { optional })
              const error = moduleUser.errors.USER_SESSION_EXPIRED()
              await expect(shouldReject).rejects.toThrow(error)
            })
          })
        }
      })
    })
  }
})
