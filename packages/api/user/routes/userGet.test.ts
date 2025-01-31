import type { Context } from '../../__fixtures__'
import { createContext } from '../../__fixtures__'

describe.concurrent<Context>('request GET /api/user', () => {
  beforeEach<Context>(async(context) => {
    context.ctx = await createContext()
    await context.ctx.createServer()
  })

  afterEach<Context>(async(context) => {
    await context.ctx.destroy()
  })

  describe<Context>('with authenticated user', (it) => {
    it('should return the user details when requesting its own details', async({ expect, ctx }) => {
      const { user, headers } = await ctx.createUser('jdoe')
      const response = await ctx.fetch('/api/users/jdoe', { method: 'GET', headers })
      const body = await response.json() as Record<string, string>
      expect(response.status).toBe(200)
      expect(response.statusText).toBe('OK')
      expect(body).toStrictEqual({ username: user.username })
    })

    it('should return an error if the user requests the details of another user', async({ expect, ctx }) => {
      const { headers } = await ctx.createUser('jdoe')
      await ctx.createUser('other')
      const response = await ctx.fetch('/api/users/other', { method: 'GET', headers })
      const body = await response.json() as Record<string, string>
      expect(response.status).toBe(403)
      expect(response.statusText).toBe('Forbidden')
      expect(body).toMatchObject({ data: { name: 'E_USER_NOT_ALLOWED' } })
    })

    it('should return an error if the user does not exist', async({ expect, ctx }) => {
      const { headers } = await ctx.createUser('jdoe')
      const response = await ctx.fetch('/api/users/does-not-exists', { method: 'GET', headers })
      const body = await response.json() as Record<string, string>
      expect(response.status).toBe(403)
      expect(response.statusText).toBe('Forbidden')
      expect(body).toMatchObject({ data: { name: 'E_USER_NOT_ALLOWED' } })
    })

    it('should return an error if the user is deleted', async({ expect, ctx }) => {
      const { headers } = await ctx.createUser('jdoe')
      const { user } = await ctx.createUser('other')
      const { User } = ctx.ModuleUser.getRepositories()
      await User.softRemove(user)
      const response = await ctx.fetch('/api/users/other', { method: 'GET', headers })
      const body = await response.json() as Record<string, string>
      expect(response.status).toBe(403)
      expect(response.statusText).toBe('Forbidden')
      expect(body).toMatchObject({ data: { name: 'E_USER_NOT_ALLOWED' } })
    })
  })

  describe<Context>('with super administrator', (it) => {
    it('should return the user details of the super administrator', async({ expect, ctx }) => {
      const { user, headers } = await ctx.createUser('jdoe', { isSuperAdministrator: true })
      const response = await ctx.fetch('/api/users/jdoe', { method: 'GET', headers })
      const body = await response.json() as Record<string, string>
      expect(response.status).toBe(200)
      expect(response.statusText).toBe('OK')
      expect(body).toStrictEqual({ username: user.username })
    })

    it('should return the user details of another user', async({ expect, ctx }) => {
      const { headers } = await ctx.createUser('jdoe', { isSuperAdministrator: true })
      await ctx.createUser('other')
      const response = await ctx.fetch('/api/users/other', { method: 'GET', headers })
      const body = await response.json() as Record<string, string>
      expect(response.status).toBe(200)
      expect(response.statusText).toBe('OK')
      expect(body).toStrictEqual({ username: 'other' })
    })

    it('should return an error if the user does not exist', async({ expect, ctx }) => {
      const { headers } = await ctx.createUser('jdoe', { isSuperAdministrator: true })
      const response = await ctx.fetch('/api/users/does-not-exists', { method: 'GET', headers })
      const body = await response.json() as Record<string, string>
      expect(response.status).toBe(404)
      expect(response.statusText).toBe('Not Found')
      expect(body).toMatchObject({ data: { name: 'E_USER_NOT_FOUND' } })
    })

    it('should return the user details of a deleted user', async({ expect, ctx }) => {
      const { headers } = await ctx.createUser('jdoe', { isSuperAdministrator: true })
      const { user } = await ctx.createUser('other')
      const { User } = ctx.ModuleUser.getRepositories()
      await User.softRemove(user)
      const response = await ctx.fetch('/api/users/other', { method: 'GET', headers })
      const body = await response.json() as Record<string, string>
      expect(response.status).toBe(200)
      expect(response.statusText).toBe('OK')
      expect(body).toMatchObject({ username: 'other' })
    })
  })

  describe<Context>('with unauthenticated user', (it) => {
    it('should return an error if the user does not exist', async({ expect, ctx }) => {
      const response = await ctx.fetch('/api/users/does-not-exists', { method: 'GET' })
      const body = await response.json() as Record<string, string>
      expect(response.status).toBe(401)
      expect(response.statusText).toBe('Unauthorized')
      expect(body).toMatchObject({ data: { name: 'E_USER_NOT_AUTHENTICATED' } })
    })

    it('should return an error if the user exists but the request is not authenticated', async({ expect, ctx }) => {
      await ctx.createUser('jdoe')
      const response = await ctx.fetch('/api/users/jdoe', { method: 'GET' })
      const body = await response.json() as Record<string, string>
      expect(response.status).toBe(401)
      expect(response.statusText).toBe('Unauthorized')
      expect(body).toMatchObject({ data: { name: 'E_USER_NOT_AUTHENTICATED' } })
    })
  })
})
