/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import { EXP_UUID } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'

describe.concurrent<Context>('userGet', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
    await context.application.createTestServer()
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  describe<Context>('with super administrator', () => {
    describe<Context>('own user', (it) => {
      it('should return the user', async({ createUser, application }) => {
        const { headers } = await createUser('admin', { isSuperAdministrator: true })
        const response = await application.fetch('/api/users/admin', { method: 'GET', headers })
        const body = await response.json() as Record<string, string>
        expect(response.status).toBe(200)
        expect(response.statusText).toBe('OK')
        expect(body).toStrictEqual({
          id: expect.stringMatching(EXP_UUID),
          username: 'admin',
          email: 'admin@acme.com',
          displayName: 'admin',
          avatarUrl: '/api/users/admin/avatar',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        })
      })

      it('should return the user with profile details', async({ createUser, moduleUser, application }) => {
        const { user, headers } = await createUser('admin', { isSuperAdministrator: true })
        user.profile!.displayName = 'John Doe'
        user.profile!.company = 'Acme Inc.'
        user.profile!.website = 'https://acme.com'
        user.profile!.biography = 'A short biography'
        user.profile!.socials = ['https://twitter.com/acme']
        await moduleUser.getRepositories().User.save(user)
        const response = await application.fetch('/api/users/admin?withProfile=true', { method: 'GET', headers })
        const body = await response.json() as Record<string, string>
        expect(response.status).toBe(200)
        expect(response.statusText).toBe('OK')
        expect(body).toStrictEqual({
          id: expect.stringMatching(EXP_UUID),
          username: 'admin',
          email: 'admin@acme.com',
          displayName: 'John Doe',
          avatarUrl: '/api/users/admin/avatar',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),

          biography: 'A short biography',
          company: 'Acme Inc.',
          socials: ['https://twitter.com/acme'],
          website: 'https://acme.com',
        })
      })

      it('should return the user with session details', async({ createUser, application }) => {
        const { headers } = await createUser('admin', { isSuperAdministrator: true })
        const response = await application.fetch('/api/users/admin?withSessions=true', { method: 'GET', headers })
        const body = await response.json() as Record<string, string>
        expect(response.status).toBe(200)
        expect(response.statusText).toBe('OK')
        expect(body).toStrictEqual({
          id: expect.stringMatching(EXP_UUID),
          username: 'admin',
          email: 'admin@acme.com',
          displayName: 'admin',
          avatarUrl: '/api/users/admin/avatar',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),

          sessions: expect.any(Array),
          lastSeenAt: expect.any(String),
        })
      })
    })

    describe<Context>('other user', (it) => {
      it('should return the user of another user', async({ createUser, application }) => {
        const { headers } = await createUser('admin', { isSuperAdministrator: true })
        await createUser('jdoe')
        const response = await application.fetch('/api/users/jdoe', { method: 'GET', headers })
        const body = await response.json() as Record<string, string>
        expect(response.status).toBe(200)
        expect(response.statusText).toBe('OK')
        expect(body).toStrictEqual({
          id: expect.stringMatching(EXP_UUID),
          username: 'jdoe',
          email: 'jdoe@acme.com',
          displayName: 'jdoe',
          avatarUrl: '/api/users/jdoe/avatar',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        })
      })

      it('should return the user with profile details', async({ createUser, moduleUser, application }) => {
        const { headers } = await createUser('admin', { isSuperAdministrator: true })
        const { user } = await createUser('jdoe')
        user.profile!.displayName = 'John Doe'
        user.profile!.company = 'Acme Inc.'
        user.profile!.website = 'https://acme.com'
        user.profile!.biography = 'A short biography'
        user.profile!.socials = ['https://twitter.com/acme']
        await moduleUser.getRepositories().User.save(user)
        const response = await application.fetch('/api/users/jdoe?withProfile=true', { method: 'GET', headers })
        const body = await response.json() as Record<string, string>
        expect(response.status).toBe(200)
        expect(response.statusText).toBe('OK')
        expect(body).toStrictEqual({
          id: expect.stringMatching(EXP_UUID),
          username: 'jdoe',
          email: 'jdoe@acme.com',
          displayName: 'John Doe',
          avatarUrl: '/api/users/jdoe/avatar',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),

          biography: 'A short biography',
          company: 'Acme Inc.',
          socials: ['https://twitter.com/acme'],
          website: 'https://acme.com',
        })
      })

      it('should return the user with session details', async({ createUser, application }) => {
        const { headers } = await createUser('admin', { isSuperAdministrator: true })
        await createUser('jdoe')
        const response = await application.fetch('/api/users/jdoe?withSessions=true', { method: 'GET', headers })
        const body = await response.json() as Record<string, string>
        expect(response.status).toBe(200)
        expect(response.statusText).toBe('OK')
        expect(body).toStrictEqual({
          id: expect.stringMatching(EXP_UUID),
          email: 'jdoe@acme.com',
          username: 'jdoe',
          displayName: 'jdoe',
          avatarUrl: '/api/users/jdoe/avatar',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),

          sessions: expect.any(Array),
          lastSeenAt: expect.any(String),
        })
      })
    })

    describe<Context>('edge cases', (it) => {
      it('should return deleted user', async({ createUser, application }) => {
        const { headers } = await createUser('admin', { isSuperAdministrator: true })
        await createUser('jdoe', { deletedAt: new Date() })
        const response = await application.fetch('/api/users/jdoe?withDeleted=true', { method: 'GET', headers })
        const body = await response.json() as Record<string, string>
        expect(response.status).toBe(200)
        expect(response.statusText).toBe('OK')
        expect(body).toMatchObject({ username: 'jdoe' })
      })

      it('should return disabled user', async({ createUser, application }) => {
        const { headers } = await createUser('admin', { isSuperAdministrator: true })
        await createUser('jdoe', { disabledAt: new Date() })
        const response = await application.fetch('/api/users/jdoe?withDisabled=true', { method: 'GET', headers })
        const body = await response.json() as Record<string, string>
        expect(response.status).toBe(200)
        expect(response.statusText).toBe('OK')
        expect(body).toMatchObject({ username: 'jdoe' })
      })

      it('should return an error if the user does not exist', async({ createUser, application }) => {
        const { headers } = await createUser('admin', { isSuperAdministrator: true })
        const response = await application.fetch('/api/users/does-not-exists', { method: 'GET', headers })
        const body = await response.json() as Record<string, string>
        expect(response.status).toBe(404)
        expect(response.statusText).toBe('Not Found')
        expect(body).toMatchObject({ data: { name: 'E_USER_NOT_FOUND' } })
      })
    })
  })

  describe<Context>('with authenticated user', () => {
    describe<Context>('own user', (it) => {
      it('should return the user', async({ createUser, application }) => {
        const { headers } = await createUser('jdoe')
        const response = await application.fetch('/api/users/jdoe', { method: 'GET', headers })
        const body = await response.json() as Record<string, string>
        expect(response.status).toBe(200)
        expect(response.statusText).toBe('OK')
        expect(body).toStrictEqual({
          id: expect.stringMatching(EXP_UUID),
          username: 'jdoe',
          email: 'jdoe@acme.com',
          displayName: 'jdoe',
          avatarUrl: '/api/users/jdoe/avatar',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        })
      })

      it('should return own user with profile details', async({ createUser, moduleUser, application }) => {
        const { user, headers } = await createUser('jdoe')
        user.profile!.displayName = 'John Doe'
        user.profile!.company = 'Acme Inc.'
        user.profile!.website = 'https://acme.com'
        user.profile!.biography = 'A short biography'
        user.profile!.socials = ['https://twitter.com/acme']
        await moduleUser.getRepositories().User.save(user)
        const response = await application.fetch('/api/users/jdoe?withProfile=true', { method: 'GET', headers })
        const body = await response.json() as Record<string, string>
        expect(response.status).toBe(200)
        expect(response.statusText).toBe('OK')
        expect(body).toStrictEqual({
          id: expect.stringMatching(EXP_UUID),
          username: 'jdoe',
          email: 'jdoe@acme.com',
          displayName: 'John Doe',
          avatarUrl: '/api/users/jdoe/avatar',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),

          biography: 'A short biography',
          company: 'Acme Inc.',
          socials: ['https://twitter.com/acme'],
          website: 'https://acme.com',
        })
      })

      it('should return own user with session details', async({ createUser, application }) => {
        const { headers } = await createUser('jdoe')
        const response = await application.fetch('/api/users/jdoe?withSessions=true', { method: 'GET', headers })
        const body = await response.json() as Record<string, string>
        expect(response.status).toBe(200)
        expect(response.statusText).toBe('OK')
        expect(body).toStrictEqual({
          id: expect.stringMatching(EXP_UUID),
          username: 'jdoe',
          email: 'jdoe@acme.com',
          displayName: 'jdoe',
          avatarUrl: '/api/users/jdoe/avatar',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),

          sessions: expect.any(Array),
          lastSeenAt: expect.any(String),
        })
      })
    })

    describe<Context>('other user', (it) => {
      it('should return the user of another user', async({ createUser, application }) => {
        const { headers } = await createUser('user')
        await createUser('jdoe')
        const response = await application.fetch('/api/users/jdoe', { method: 'GET', headers })
        const body = await response.json() as Record<string, string>
        expect(response.status).toBe(200)
        expect(response.statusText).toBe('OK')
        expect(body).toStrictEqual({
          username: 'jdoe',
          displayName: 'jdoe',
          avatarUrl: '/api/users/jdoe/avatar',
        })
      })

      it('should return the user with profile details', async({ createUser, moduleUser, application }) => {
        const { headers } = await createUser('user')
        const { user } = await createUser('jdoe')
        user.profile!.displayName = 'John Doe'
        user.profile!.company = 'Acme Inc.'
        user.profile!.website = 'https://acme.com'
        user.profile!.biography = 'A short biography'
        user.profile!.socials = ['https://twitter.com/acme']
        await moduleUser.getRepositories().User.save(user)
        const response = await application.fetch('/api/users/jdoe?withProfile=true', { method: 'GET', headers })
        const body = await response.json() as Record<string, string>
        expect(response.status).toBe(200)
        expect(response.statusText).toBe('OK')
        expect(body).toStrictEqual({
          username: 'jdoe',
          displayName: 'John Doe',
          avatarUrl: '/api/users/jdoe/avatar',
          biography: 'A short biography',
          company: 'Acme Inc.',
          socials: ['https://twitter.com/acme'],
          website: 'https://acme.com',
        })
      })

      it('should return an error if the user requests the session details of another user', async({ createUser, application }) => {
        const { headers } = await createUser('user')
        await createUser('jdoe')
        const response = await application.fetch('/api/users/jdoe?withSessions=true', { method: 'GET', headers })
        const body = await response.json() as Record<string, string>
        expect(response.status).toBe(403)
        expect(response.statusText).toBe('Forbidden')
        expect(body).toMatchObject({ data: { name: 'E_USER_NOT_ALLOWED' } })
      })
    })

    describe<Context>('edge cases', (it) => {
      it('should return an error if the user is deleted', async({ createUser, moduleUser, application }) => {
        const { headers } = await createUser('user')
        const { user } = await createUser('jdoe')
        const { User } = moduleUser.getRepositories()
        await User.softRemove(user)
        const response = await application.fetch('/api/users/other', { method: 'GET', headers })
        const body = await response.json() as Record<string, string>
        expect(response.status).toBe(404)
        expect(response.statusText).toBe('Not Found')
        expect(body).toMatchObject({ data: { name: 'E_USER_NOT_FOUND' } })
      })

      it('should return an error if the user is disabled', async({ createUser, moduleUser, application }) => {
        const { headers } = await createUser('user')
        const { user } = await createUser('jdoe')
        user.disabledAt = new Date()
        await moduleUser.getRepositories().User.save(user)
        const response = await application.fetch('/api/users/other', { method: 'GET', headers })
        const body = await response.json() as Record<string, string>
        expect(response.status).toBe(404)
        expect(response.statusText).toBe('Not Found')
        expect(body).toMatchObject({ data: { name: 'E_USER_NOT_FOUND' } })
      })

      it('should return an error if the user does not exist', async({ createUser, application }) => {
        const { headers } = await createUser('user')
        const response = await application.fetch('/api/users/does-not-exists', { method: 'GET', headers })
        const body = await response.json() as Record<string, string>
        expect(response.status).toBe(404)
        expect(response.statusText).toBe('Not Found')
        expect(body).toMatchObject({ data: { name: 'E_USER_NOT_FOUND' } })
      })
    })
  })

  describe<Context>('with unauthenticated user', (it) => {
    it('should return with E_USER_NOT_AUTHENTICATED if the user does not exist', async({ application }) => {
      const response = await application.fetch('/api/users/does-not-exists', { method: 'GET' })
      const body = await response.json() as Record<string, string>
      expect(response.status).toBe(401)
      expect(response.statusText).toBe('Unauthorized')
      expect(body).toMatchObject({ data: { name: 'E_USER_NOT_AUTHENTICATED' } })
    })

    it('should return with E_USER_NOT_AUTHENTICATED if the user exists but the request is not authenticated', async({ createUser, application }) => {
      await createUser('jdoe')
      const response = await application.fetch('/api/users/jdoe', { method: 'GET' })
      const body = await response.json() as Record<string, string>
      expect(response.status).toBe(401)
      expect(response.statusText).toBe('Unauthorized')
      expect(body).toMatchObject({ data: { name: 'E_USER_NOT_AUTHENTICATED' } })
    })
  })
}, 5000)
