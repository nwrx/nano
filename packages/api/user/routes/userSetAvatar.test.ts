/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import { EXP_UUID } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { ERRORS } from '../utils'

function createFormData(type: string, headers: Record<string, string>): string {
  const extension = type.split('/')[1]
  const boundary = '12345'
  headers['Content-Type'] = `multipart/form-data; boundary=${boundary}`
  return [
    `--${boundary}`,
    `Content-Disposition: form-data; name="file"; filename="avatar.${extension}"`,
    `Content-Type: ${type}`,
    '',
    'DATA',
    `--${boundary}--`,
    '', // Final CRLF at the end of the body
  ].join('\r\n')
}

describe('userSetAvatar', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
    await context.application.createTestServer()
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  describe<Context>('with super administrator', () => {
    describe<Context>('own user', (it) => {
      it('should call the download function and return its result', async({ createUser, application }) => {
        const { headers } = await createUser('admin', { isSuperAdministrator: true })
        const body = createFormData('image/png', headers)
        const response = await application.fetch('/api/users/admin/avatar', { method: 'PUT', headers, body })
        expect(response.status).toBe(201)
        expect(response.statusText).toBe('Created')
      })

      it('should store the avatar\'s file entity in the database', async({ createUser, moduleUser, application }) => {
        const { user, headers } = await createUser('admin', { isSuperAdministrator: true })
        const body = createFormData('image/png', headers)
        await application.fetch('/api/users/admin/avatar', { method: 'PUT', headers, body })
        const profile = await moduleUser.getRepositories().UserProfile.findOneOrFail({
          where: { user: { id: user.id } },
          relations: { avatar: true },
        })
        expect(profile.avatar).toMatchObject({
          id: expect.stringMatching(EXP_UUID),
          assignments: undefined,
          size: 4,
          pool: 'default',
          type: 'image/png',
          name: 'avatar-admin',
          origin: `user:${user.id}`,
          hash: 'c97c29c7a71b392b437ee03fd17f09bb10b75e879466fc0eb757b2c4a78ac938',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          deletedAt: undefined,
        })
      })

      it('should store the avatar\'s file content in the storage pool', async({ createUser, moduleUser, moduleStorage, application }) => {
        const { user, headers } = await createUser('admin', { isSuperAdministrator: true })
        const body = createFormData('image/png', headers)
        await application.fetch('/api/users/admin/avatar', { method: 'PUT', headers, body })
        const profile = await moduleUser.getRepositories().UserProfile.findOneOrFail({
          where: { user: { id: user.id } },
          relations: { avatar: true },
        })
        const entity = await moduleStorage.download(profile.avatar!)
        const data = await entity.getText()
        expect(data).toBe('DATA')
      })
    })

    describe<Context>('other user', (it) => {
      it('should call the download function and return its result', async({ createUser, application }) => {
        const { headers } = await createUser('admin', { isSuperAdministrator: true })
        await createUser('jdoe')
        const body = createFormData('image/png', headers)
        const response = await application.fetch('/api/users/jdoe/avatar', { method: 'PUT', headers, body })
        expect(response.status).toBe(201)
        expect(response.statusText).toBe('Created')
      })

      it('should store the avatar\'s file entity in the database', async({ createUser, moduleUser, application }) => {
        const { headers } = await createUser('admin', { isSuperAdministrator: true })
        const { user } = await createUser('jdoe')
        const body = createFormData('image/png', headers)
        await application.fetch('/api/users/jdoe/avatar', { method: 'PUT', headers, body })
        const profile = await moduleUser.getRepositories().UserProfile.findOneOrFail({
          where: { user: { id: user.id } },
          relations: { avatar: true },
        })
        expect(profile.avatar).toMatchObject({
          id: expect.stringMatching(EXP_UUID),
          assignments: undefined,
          size: 4,
          pool: 'default',
          type: 'image/png',
          name: 'avatar-jdoe',
          origin: `user:${user.id}`,
          hash: 'c97c29c7a71b392b437ee03fd17f09bb10b75e879466fc0eb757b2c4a78ac938',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          deletedAt: undefined,
        })
      })

      it('should store the avatar\'s file content in the storage pool', async({ createUser, moduleUser, moduleStorage, application }) => {
        const { headers } = await createUser('admin', { isSuperAdministrator: true })
        const { user } = await createUser('jdoe')
        const body = createFormData('image/png', headers)
        await application.fetch('/api/users/jdoe/avatar', { method: 'PUT', headers, body })
        const profile = await moduleUser.getRepositories().UserProfile.findOneOrFail({
          where: { user: { id: user.id } },
          relations: { avatar: true },
        })
        const entity = await moduleStorage.download(profile.avatar!)
        const data = await entity.getText()
        expect(data).toBe('DATA')
      })
    })
  })

  describe<Context>('with authenticated user', () => {
    describe<Context>('own user', (it) => {
      it('should call the download function and return its result', async({ createUser, application }) => {
        const { headers } = await createUser('jdoe')
        const body = createFormData('image/png', headers)
        const response = await application.fetch('/api/users/jdoe/avatar', { method: 'PUT', headers, body })
        expect(response.status).toBe(201)
        expect(response.statusText).toBe('Created')
      })

      it('should store the avatar\'s file entity in the database', async({ createUser, moduleUser, application }) => {
        const { user, headers } = await createUser('jdoe')
        const body = createFormData('image/png', headers)
        await application.fetch('/api/users/jdoe/avatar', { method: 'PUT', headers, body })
        const profile = await moduleUser.getRepositories().UserProfile.findOneOrFail({
          where: { user: { id: user.id } },
          relations: { avatar: true },
        })
        expect(profile.avatar).toMatchObject({
          id: expect.stringMatching(EXP_UUID),
          assignments: undefined,
          size: 4,
          pool: 'default',
          type: 'image/png',
          name: 'avatar-jdoe',
          origin: `user:${user.id}`,
          hash: 'c97c29c7a71b392b437ee03fd17f09bb10b75e879466fc0eb757b2c4a78ac938',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          deletedAt: undefined,
        })
      })

      it('should store the avatar\'s file content in the storage pool', async({ createUser, moduleUser, moduleStorage, application }) => {
        const { user, headers } = await createUser('jdoe')
        const body = createFormData('image/png', headers)
        await application.fetch('/api/users/jdoe/avatar', { method: 'PUT', headers, body })
        const profile = await moduleUser.getRepositories().UserProfile.findOneOrFail({
          where: { user: { id: user.id } },
          relations: { avatar: true },
        })
        const entity = await moduleStorage.download(profile.avatar!)
        const data = await entity.getText()
        expect(data).toBe('DATA')
      })
    })

    describe<Context>('other user', (it) => {
      it('should throw an error if the user is not a super administrator', async({ createUser, application }) => {
        const { headers } = await createUser('user')
        await createUser('jdoe')
        const body = createFormData('image/png', headers)
        const response = await application.fetch('/api/users/jdoe/avatar', { method: 'PUT', headers, body })
        const text = await response.text()
        const error = ERRORS.USER_NOT_ALLOWED()
        expect(response.status).toBe(403)
        expect(response.statusText).toBe('Forbidden')
        expect(text).toContain(error.message)
      })
    })

    describe<Context>('invalid file', (it) => {
      it('should throw an error if the file is not an image', async({ createUser, application }) => {
        const { headers } = await createUser('jdoe')
        const body = createFormData('text/plain', headers)
        const response = await application.fetch('/api/users/jdoe/avatar', { method: 'PUT', headers, body })
        const text = await response.text()
        const error = ERRORS.USER_AVATAR_NOT_IMAGE()
        expect(response.status).toBe(400)
        expect(response.statusText).toBe('Bad Request')
        expect(text).toContain(error.message)
      })
    })
  })

  describe<Context>('with unauthenticated user', (it) => {
    it('should throw an error if the user is not authenticated', async({ application }) => {
      const headers = {}
      const body = createFormData('image/png', headers)
      const response = await application.fetch('/api/users/jdoe/avatar', { method: 'PUT', headers, body })
      const text = await response.text()
      const error = ERRORS.USER_NOT_AUTHENTICATED()
      expect(response.status).toBe(401)
      expect(response.statusText).toBe('Unauthorized')
      expect(text).toContain(error.message)
    })
  })
})
