/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import { EXP_UUID } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'

describe.concurrent('userSessionGet', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
    await context.application.createTestServer()
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  describe<Context>('with authenticated user', (it) => {
    it('should return the username of the authenticated user', async({ createUser, application }) => {
      const { headers } = await createUser()
      const response = await application.fetch('/api/session', { method: 'GET', headers })
      const body = await response.json() as Record<string, string>
      expect(response.status).toBe(200)
      expect(response.headers.get('Content-Type')).toBe('application/json')
      expect(body).toStrictEqual({
        id: expect.stringMatching(EXP_UUID),
        username: 'jdoe',
        email: 'jdoe@acme.com',
        displayName: 'jdoe',
        avatarUrl: '/api/users/jdoe/avatar',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),

        biography: '',
        company: '',
        socials: [],
        website: '',
      })
    })
  })

  describe<Context>('with unauthenticated user', (it) => {
    it('should return empty object if the user is not authenticated', async({ application }) => {
      const response = await application.fetch('/api/session', { method: 'GET' })
      expect(response).toMatchObject({ status: 204, statusText: 'No Content' })
    })
  })

  describe<Context>('with invalid user session', (it) => {
    it('should return an error if the session is invalid', async({ createUser, moduleUser, application }) => {
      const { session, headers } = await createUser()
      const { UserSession } = moduleUser.getRepositories()
      session.expiresAt = new Date(0)
      await UserSession.save(session)
      const response = await application.fetch('/api/session', { method: 'GET', headers })
      const body = await response.json() as Record<string, string>
      expect(response.status).toBe(401)
      expect(response.headers.get('Content-Type')).toBe('application/json')
      expect(body).toMatchObject({ data: { name: 'E_USER_SESSION_EXPIRED' } })
    })

    it('should return an error if the session address is not matching', async({ createUser, moduleUser, application }) => {
      const { session, headers } = await createUser()
      const { UserSession } = moduleUser.getRepositories()
      session.address = '0.0.0.0'
      await UserSession.save(session)
      const response = await application.fetch('/api/session', { method: 'GET', headers })
      const body = await response.json() as Record<string, string>
      expect(response.status).toBe(401)
      expect(response.headers.get('Content-Type')).toBe('application/json')
      expect(body).toMatchObject({ data: { name: 'E_USER_SESSION_NOT_FOUND' } })
    })

    it('should return an error if the session user agent is not matching', async({ createUser, moduleUser, application }) => {
      const { session, headers } = await createUser()
      const { UserSession } = moduleUser.getRepositories()
      session.userAgent = 'Not-Mozilla/5.0'
      await UserSession.save(session)
      const response = await application.fetch('/api/session', { method: 'GET', headers })
      const body = await response.json() as Record<string, string>
      expect(response.status).toBe(401)
      expect(response.headers.get('Content-Type')).toBe('application/json')
      expect(body).toMatchObject({ data: { name: 'E_USER_SESSION_NOT_FOUND' } })
    })

    it('should delete the local cookie if the session is invalid', async({ createUser, moduleUser, application }) => {
      const { session, headers } = await createUser()
      const { UserSession } = moduleUser.getRepositories()
      session.expiresAt = new Date(0)
      await UserSession.save(session)
      const response = await application.fetch('/api/session', { method: 'GET', headers })
      expect(response.status).toBe(401)
      expect(response.headers.get('Content-Type')).toBe('application/json')
      expect(response.headers.get('Set-Cookie')).toBe('__Host-Session-Token=; Max-Age=0; Path=/; HttpOnly; Secure')
    })
  })
}, 1000)
