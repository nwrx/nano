import type { Context } from '../../__fixtures__'
import { createContext } from '../../__fixtures__'

describe.concurrent<Context>('userSessionGet', () => {
  beforeEach<Context>(async(context) => {
    context.ctx = await createContext()
    await context.ctx.createServer()
  })

  afterEach<Context>(async(context) => {
    await context.ctx.destroy()
  })

  describe<Context>('with authenticated user', (it) => {
    it('should return the username of the authenticated user', async({ expect, ctx }) => {
      const { headers } = await ctx.createUser()
      const response = await ctx.fetch('/api/session', { method: 'GET', headers })
      const body = await response.json() as Record<string, string>
      expect(response.status).toBe(200)
      expect(response.headers.get('Content-Type')).toBe('application/json')
      expect(body).toStrictEqual({
        avatarUrl: '/api/users/jdoe/avatar',
        displayName: 'jdoe',
        email: 'jdoe@acme.com',
        username: 'jdoe',
      })
    })

    it('should return empty object if the user is not authenticated', async({ expect, ctx }) => {
      const response = await ctx.fetch('/api/session', { method: 'GET' })
      const body = await response.json() as Record<string, string>
      expect(response.status).toBe(200)
      expect(response.headers.get('Content-Type')).toBe('application/json')
      expect(body).toStrictEqual({})
    })
  })

  describe<Context>('with invalid user session', (it) => {
    it('should return an error if the session token is invalid', async({ expect, ctx }) => {
      const headers = { Cookie: `${ctx.ModuleUser.userSessionCookieName}=000000` }
      const response = await ctx.fetch('/api/session', { method: 'GET', headers })
      const body = await response.json() as Record<string, string>
      expect(response.status).toBe(401)
      expect(response.headers.get('Content-Type')).toBe('application/json')
      expect(body).toMatchObject({ data: { name: 'E_USER_SESSION_NOT_FOUND' } })
    })

    it('should return an error if the session is expired', async({ expect, ctx }) => {
      const { session, headers } = await ctx.createUser()
      const { UserSession } = ctx.ModuleUser.getRepositories()
      session.expiresAt = new Date(0)
      await UserSession.save(session)
      const response = await ctx.fetch('/api/session', { method: 'GET', headers })
      const body = await response.json() as Record<string, string>
      expect(response.status).toBe(401)
      expect(response.headers.get('Content-Type')).toBe('application/json')
      expect(body).toMatchObject({ data: { name: 'E_USER_SESSION_EXPIRED' } })
    })

    it('should return an error if the session address is invalid', async({ expect, ctx }) => {
      const { session, headers } = await ctx.createUser()
      const { UserSession } = ctx.ModuleUser.getRepositories()
      session.address = '10.10.10.10'
      await UserSession.save(session)
      const response = await ctx.fetch('/api/session', { method: 'GET', headers })
      const body = await response.json() as Record<string, string>
      expect(response.status).toBe(401)
      expect(response.headers.get('Content-Type')).toBe('application/json')
      expect(body).toMatchObject({ data: { name: 'E_USER_SESSION_NOT_FOUND' } })
    })

    it('should return an error if the session user agent is invalid', async({ expect, ctx }) => {
      const { session, headers } = await ctx.createUser()
      const { UserSession } = ctx.ModuleUser.getRepositories()
      session.userAgent = 'Mozilla/5.0'
      await UserSession.save(session)
      const response = await ctx.fetch('/api/session', { method: 'GET', headers })
      const body = await response.json() as Record<string, string>
      expect(response.status).toBe(401)
      expect(response.headers.get('Content-Type')).toBe('application/json')
      expect(body).toMatchObject({ data: { name: 'E_USER_SESSION_NOT_FOUND' } })
    })
  })
})
