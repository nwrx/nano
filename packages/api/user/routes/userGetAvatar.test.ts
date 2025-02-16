import type { Context } from '../../__fixtures__'
import { dedent } from '@unshared/string'
import { createTestContext } from '../../__fixtures__'

function createAvatarSvg(initials: string) {
  return dedent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
      <circle cx="50" cy="50" r="50" fill="#f0f0f0"/>
      <text x="50" y="50" text-anchor="middle" dominant-baseline="central" font-size="40" fill="#000000">
        ${initials}
      </text>
    </svg>
  `)
}

describe.sequential('userGetAvatar', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
    await context.application.createTestServer()
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  describe('with unauthenticated user', () => {
    describe<Context>('of user having no avatar', (it) => {
      it('should return an SVG placeholder', async({ createUser, application }) => {
        await createUser('jdoe')
        const response = await application.fetch('/api/users/jdoe/avatar')
        const content = await response.text()
        expect(response.status).toBe(200)
        expect(response.headers.get('content-type')).toBe('image/svg+xml')
        expect(response.headers.get('content-length')).toBe('240')
        expect(response.headers.get('cache-control')).toBe('no-cache')
        expect(response.headers.get('content-disposition')).toBeNull()
        expect(content).toEqual(createAvatarSvg('J'))
      })

      it('should set the attachment header when download=true', async({ createUser, application }) => {
        await createUser('jdoe')
        const response = await application.fetch('/api/users/jdoe/avatar?download=true')
        const content = await response.text()
        expect(response.status).toBe(200)
        expect(response.headers.get('content-type')).toBe('image/svg+xml')
        expect(response.headers.get('content-length')).toBe('240')
        expect(response.headers.get('cache-control')).toBe('no-cache')
        expect(response.headers.get('content-disposition')).toBe('attachment; filename="avatar.svg"')
        expect(content).toEqual(createAvatarSvg('J'))
      })
    })

    describe<Context>('of user having an avatar', (it) => {
      it('should return the avatar file', async({ createUser, createAvatar, application }) => {
        const { user } = await createUser('jdoe')
        const { data } = await createAvatar(user)
        const response = await application.fetch('/api/users/jdoe/avatar')
        const content = await response.bytes()
        expect(response.status).toBe(200)
        expect(response.headers.get('content-type')).toBe('image/png')
        expect(response.headers.get('content-length')).toBe('1024')
        expect(response.headers.get('cache-control')).toBeNull()
        expect(response.headers.get('content-disposition')).toBeNull()
        expect(content).toStrictEqual(data)
      })

      it('should set content-disposition when download=true', async({ createUser, createAvatar, application }) => {
        const { user } = await createUser('jdoe')
        await createAvatar(user)
        const response = await application.fetch('/api/users/jdoe/avatar?download=true')
        const content = await response.bytes()
        expect(response.status).toBe(200)
        expect(response.headers.get('content-type')).toBe('image/png')
        expect(response.headers.get('content-length')).toBe('1024')
        expect(response.headers.get('cache-control')).toBeNull()
        expect(response.headers.get('content-disposition')).toBe('attachment; filename="avatar.png"')
        expect(content).toStrictEqual(content)
      })
    })

    describe<Context>('edge cases', (it) => {
      it('should return 404 when getting avatar of deleted user', async({ createUser, application }) => {
        await createUser('jdoe', { deletedAt: new Date() })
        const response = await application.fetch('/api/users/jdoe/avatar')
        const data = await response.json() as Record<string, string>
        expect(response.status).toBe(404)
        expect(data).toMatchObject({ data: { name: 'E_USER_NOT_FOUND' } })
      })

      it('should return 404 when getting avatar of disabled user', async({ createUser, application }) => {
        await createUser('jdoe', { disabledAt: new Date() })
        const response = await application.fetch('/api/users/jdoe/avatar')
        const data = await response.json() as Record<string, string>
        expect(response.status).toBe(404)
        expect(data).toMatchObject({ data: { name: 'E_USER_NOT_FOUND' } })
      })

      it('should return 404 when getting avatar of non-existent user', async({ application }) => {
        const response = await application.fetch('/api/users/non-existent/avatar')
        const data = await response.json() as Record<string, string>
        expect(response.status).toBe(404)
        expect(data).toMatchObject({ data: { name: 'E_USER_NOT_FOUND' } })
      })
    })
  })

  describe('with superadministrator', () => {
    describe<Context>('of user having no avatar', (it) => {
      it('should return an SVG placeholder', async({ createUser, application }) => {
        await createUser('jdoe')
        const { headers } = await createUser('admin', { isSuperAdministrator: true })
        const response = await application.fetch('/api/users/jdoe/avatar', { headers })
        const content = await response.text()
        expect(response.status).toBe(200)
        expect(response.headers.get('content-type')).toBe('image/svg+xml')
        expect(response.headers.get('content-length')).toBe('240')
        expect(response.headers.get('cache-control')).toBe('no-cache')
        expect(response.headers.get('content-disposition')).toBeNull()
        expect(content).toEqual(createAvatarSvg('J'))
      })

      it('should set the attachment header when download=true', async({ createUser, application }) => {
        await createUser('jdoe')
        const { headers } = await createUser('admin', { isSuperAdministrator: true })
        const response = await application.fetch('/api/users/jdoe/avatar?download=true', { headers })
        const content = await response.text()
        expect(response.status).toBe(200)
        expect(response.headers.get('content-type')).toBe('image/svg+xml')
        expect(response.headers.get('content-length')).toBe('240')
        expect(response.headers.get('cache-control')).toBe('no-cache')
        expect(response.headers.get('content-disposition')).toBe('attachment; filename="avatar.svg"')
        expect(content).toEqual(createAvatarSvg('J'))
      })
    })

    describe<Context>('of user having an avatar', (it) => {
      it('should return the avatar file', async({ createUser, createAvatar, application }) => {
        const { user } = await createUser('jdoe')
        const { data } = await createAvatar(user)
        const { headers } = await createUser('admin', { isSuperAdministrator: true })
        const response = await application.fetch('/api/users/jdoe/avatar', { headers })
        const content = await response.bytes()
        expect(response.status).toBe(200)
        expect(response.headers.get('content-type')).toBe('image/png')
        expect(response.headers.get('content-length')).toBe('1024')
        expect(response.headers.get('cache-control')).toBeNull()
        expect(response.headers.get('content-disposition')).toBeNull()
        expect(content).toStrictEqual(data)
      })

      it('should set content-disposition when download=true', async({ createUser, createAvatar, application }) => {
        const { user } = await createUser('jdoe')
        await createAvatar(user)
        const { headers } = await createUser('admin', { isSuperAdministrator: true })
        const response = await application.fetch('/api/users/jdoe/avatar?download=true', { headers })
        const content = await response.bytes()
        expect(response.status).toBe(200)
        expect(response.headers.get('content-type')).toBe('image/png')
        expect(response.headers.get('content-length')).toBe('1024')
        expect(response.headers.get('cache-control')).toBeNull()
        expect(response.headers.get('content-disposition')).toBe('attachment; filename="avatar.png"')
        expect(content).toStrictEqual(content)
      })
    })

    describe<Context>('edge cases', (it) => {
      it('should return the avatar of deleted user', async({ createUser, application }) => {
        await createUser('jdoe', { deletedAt: new Date() })
        const { headers } = await createUser('admin', { isSuperAdministrator: true })
        const response = await application.fetch('/api/users/jdoe/avatar', { headers })
        const content = await response.text()
        expect(response.status).toBe(200)
        expect(response.headers.get('content-type')).toBe('image/svg+xml')
        expect(response.headers.get('content-length')).toBe('240')
        expect(response.headers.get('cache-control')).toBe('no-cache')
        expect(response.headers.get('content-disposition')).toBeNull()
        expect(content).toEqual(createAvatarSvg('J'))
      })

      it('should return the avatar of disabled user', async({ createUser, application }) => {
        await createUser('jdoe', { disabledAt: new Date() })
        const { headers } = await createUser('admin', { isSuperAdministrator: true })
        const response = await application.fetch('/api/users/jdoe/avatar', { headers })
        const content = await response.text()
        expect(response.status).toBe(200)
        expect(response.headers.get('content-type')).toBe('image/svg+xml')
        expect(response.headers.get('content-length')).toBe('240')
        expect(response.headers.get('cache-control')).toBe('no-cache')
        expect(response.headers.get('content-disposition')).toBeNull()
        expect(content).toEqual(createAvatarSvg('J'))
      })

      it('should return 404 when getting avatar of non-existent user', async({ createUser, application }) => {
        const { headers } = await createUser('admin', { isSuperAdministrator: true })
        const response = await application.fetch('/api/users/non-existent/avatar', { headers })
        const data = await response.json() as Record<string, string>
        expect(response.status).toBe(404)
        expect(data).toMatchObject({ data: { name: 'E_USER_NOT_FOUND' } })
      })
    })
  })
})
