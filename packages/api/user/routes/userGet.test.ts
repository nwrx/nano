import type { Context } from '../../__fixtures__'
import { createContext } from '../../__fixtures__'

describe.concurrent<Context>('userGet', () => {
  beforeEach<Context>(async(context) => {
    context.ctx = await createContext()
    await context.ctx.createServer()
  })

  afterEach<Context>(async(context) => {
    await context.ctx.destroy()
  })

  describe<Context>('with super administrator', (it) => {
    it('should return the user of the super administrator', async({ expect, ctx }) => {
      const { headers } = await ctx.createUser('jdoe', { isSuperAdministrator: true })
      const response = await ctx.fetch('/api/users/jdoe', { method: 'GET', headers })
      const body = await response.json() as Record<string, string>
      expect(response.status).toBe(200)
      expect(response.statusText).toBe('OK')
      expect(body).toStrictEqual({ username: 'jdoe', displayName: 'jdoe' })
    })

    it('should return the user of another user', async({ expect, ctx }) => {
      const { headers } = await ctx.createUser('jdoe', { isSuperAdministrator: true })
      await ctx.createUser('other')
      const response = await ctx.fetch('/api/users/other', { method: 'GET', headers })
      const body = await response.json() as Record<string, string>
      expect(response.status).toBe(200)
      expect(response.statusText).toBe('OK')
      expect(body).toStrictEqual({ username: 'other', displayName: 'other' })
    })

    it('should return with user profile details of another user', async({ expect, ctx }) => {
      const { headers } = await ctx.createUser('jdoe', { isSuperAdministrator: true })
      const { user } = await ctx.createUser('other')
      user.profile!.displayName = 'Other User'
      user.profile!.company = 'Acme Inc.'
      user.profile!.website = 'https://acme.com'
      user.profile!.biography = 'A short biography'
      user.profile!.socials = ['https://twitter.com/acme']
      const { User } = ctx.ModuleUser.getRepositories()
      await User.save(user)
      const response = await ctx.fetch('/api/users/other?withProfile=true', { method: 'GET', headers })
      const body = await response.json() as Record<string, string>
      expect(response.status).toBe(200)
      expect(response.statusText).toBe('OK')
      expect(body).toStrictEqual({
        biography: 'A short biography',
        company: 'Acme Inc.',
        displayName: 'Other User',
        socials: ['https://twitter.com/acme'],
        username: 'other',
        website: 'https://acme.com',
      })
    })

    it('should return an error if the user does not exist', async({ expect, ctx }) => {
      const { headers } = await ctx.createUser('jdoe', { isSuperAdministrator: true })
      const response = await ctx.fetch('/api/users/does-not-exists', { method: 'GET', headers })
      const body = await response.json() as Record<string, string>
      expect(response.status).toBe(404)
      expect(response.statusText).toBe('Not Found')
      expect(body).toMatchObject({ data: { name: 'E_USER_NOT_FOUND' } })
    })

    it('should return the user of a deleted user', async({ expect, ctx }) => {
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

  describe<Context>('with authenticated user', (it) => {
    it('should return the user when requesting its own', async({ expect, ctx }) => {
      const { headers } = await ctx.createUser('jdoe')
      const response = await ctx.fetch('/api/users/jdoe', { method: 'GET', headers })
      const body = await response.json() as Record<string, string>
      expect(response.status).toBe(200)
      expect(response.statusText).toBe('OK')
      expect(body).toStrictEqual({ username: 'jdoe', displayName: 'jdoe' })
    })

    it('should return with user profile details', async({ expect, ctx }) => {
      const { user, headers } = await ctx.createUser('jdoe')
      user.profile!.displayName = 'John Doe'
      user.profile!.company = 'Acme Inc.'
      user.profile!.website = 'https://acme.com'
      user.profile!.biography = 'A short biography'
      user.profile!.socials = ['https://twitter.com/acme']
      const { User } = ctx.ModuleUser.getRepositories()
      await User.save(user)
      const response = await ctx.fetch('/api/users/jdoe?withProfile=true', { method: 'GET', headers })
      const body = await response.json() as Record<string, string>
      expect(response.status).toBe(200)
      expect(response.statusText).toBe('OK')
      expect(body).toStrictEqual({
        biography: 'A short biography',
        company: 'Acme Inc.',
        displayName: 'John Doe',
        socials: ['https://twitter.com/acme'],
        username: 'jdoe',
        website: 'https://acme.com',
      })
    })

    it('should return an error if the user requests the of another user', async({ expect, ctx }) => {
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
