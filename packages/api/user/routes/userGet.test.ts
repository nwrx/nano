/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import { createTestContext } from '../../__fixtures__'

describe.concurrent<Context>('GET /api/users/:username', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
    await context.application.createTestServer()
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  describe<Context>('with super administrator', (it) => {
    it('should return it\'s own user', async({ setupUser, application }) => {
      const { user, headers } = await setupUser({ isSuperAdministrator: true })
      const response = await application.fetch(`/api/users/${user.username}`, { headers })
      const body = await response.json() as Record<string, string>
      expect(response).toMatchObject({ status: 200, statusText: 'OK' })
      expect(body).toStrictEqual({
        username: user.username,
        email: user.email,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    })

    it('should return another user', async({ setupUser, application }) => {
      const { headers } = await setupUser({ isSuperAdministrator: true })
      const { user } = await setupUser()
      const response = await application.fetch(`/api/users/${user.username}`, { headers })
      const body = await response.json() as Record<string, string>
      expect(response).toMatchObject({ status: 200, statusText: 'OK' })
      expect(body).toStrictEqual({
        username: user.username,
        email: user.email,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    })

    it('should return deleted user', async({ setupUser, application }) => {
      const { headers } = await setupUser({ isSuperAdministrator: true })
      const { user } = await setupUser({ deletedAt: new Date() })
      const response = await application.fetch(`/api/users/${user.username}?withDeleted=true`, { headers })
      const body = await response.json() as Record<string, string>
      expect(response).toMatchObject({ status: 200, statusText: 'OK' })
      expect(body).toStrictEqual({
        username: user.username,
        email: user.email,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        deletedAt: expect.any(String),
      })
    })

    it('should return disabled user', async({ setupUser, application }) => {
      const { headers } = await setupUser({ isSuperAdministrator: true })
      const { user } = await setupUser({ disabledAt: new Date() })
      const response = await application.fetch(`/api/users/${user.username}?withDisabled=true`, { headers })
      const body = await response.json() as Record<string, string>
      expect(response).toMatchObject({ status: 200, statusText: 'OK' })
      expect(body).toStrictEqual({
        username: user.username,
        email: user.email,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        disabledAt: expect.any(String),
      })
    })

    it('should fail with E_USER_NOT_FOUND if the user does not exist', async({ setupUser, application }) => {
      const { headers } = await setupUser({ isSuperAdministrator: true })
      const response = await application.fetch('/api/users/does-not-exists', { headers })
      const body = await response.json() as Record<string, string>
      expect(response).toMatchObject({ status: 404, statusText: 'Not Found' })
      expect(body).toMatchObject({ data: { name: 'E_USER_NOT_FOUND' } })
    })
  })

  describe<Context>('with authenticated user', (it) => {
    it('should return it\'s own user', async({ setupUser, application }) => {
      const { user, headers } = await setupUser()
      const response = await application.fetch(`/api/users/${user.username}`, { headers })
      const body = await response.json() as Record<string, string>
      expect(response).toMatchObject({ status: 200, statusText: 'OK' })
      expect(body).toStrictEqual({
        username: user.username,
        email: user.email,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    })

    it('should return another user', async({ setupUser, application }) => {
      const { headers } = await setupUser()
      const { user } = await setupUser()
      const response = await application.fetch(`/api/users/${user.username}`, { headers })
      const body = await response.json() as Record<string, string>
      expect(response).toMatchObject({ status: 200, statusText: 'OK' })
      expect(body).toStrictEqual({ username: user.username })
    })

    it('should fail with E_USER_NOT_FOUND if the user does not exist', async({ setupUser, application }) => {
      const { headers } = await setupUser()
      const response = await application.fetch('/api/users/does-not-exists', { headers })
      const body = await response.json() as Record<string, string>
      expect(response).toMatchObject({ status: 404, statusText: 'Not Found' })
      expect(body).toMatchObject({ data: { name: 'E_USER_NOT_FOUND' } })
    })

    it('should fail with E_USER_NOT_FOUND if the user is disabled', async({ setupUser, application }) => {
      const { headers } = await setupUser()
      const { user } = await setupUser({ disabledAt: new Date() })
      const response = await application.fetch(`/api/users/${user.username}`, { headers })
      const body = await response.json() as Record<string, string>
      expect(response).toMatchObject({ status: 404, statusText: 'Not Found' })
      expect(body).toMatchObject({ data: { name: 'E_USER_NOT_FOUND' } })
    })

    it('should fail with E_USER_UNAUTHORIZED if the user is deleted', async({ setupUser, application }) => {
      const { headers } = await setupUser()
      const { user } = await setupUser({ deletedAt: new Date() })
      const response = await application.fetch(`/api/users/${user.username}`, { headers })
      const body = await response.json() as Record<string, string>
      expect(response).toMatchObject({ status: 404, statusText: 'Not Found' })
      expect(body).toMatchObject({ data: { name: 'E_USER_NOT_FOUND' } })
    })

    it('should fail with E_USER_FORBIDDEN if the user is attempting to access a disabled user', async({ setupUser, application }) => {
      const { headers } = await setupUser()
      const { user: other } = await setupUser()
      const response = await application.fetch(`/api/users/${other.username}?withDisabled=true`, { headers })
      const body = await response.json() as Record<string, string>
      expect(response).toMatchObject({ status: 403, statusText: 'Forbidden' })
      expect(body).toMatchObject({ data: { name: 'E_USER_FORBIDDEN' } })
    })

    it('should fail with E_USER_FORBIDDEN if the user is attempting to access a deleted user', async({ setupUser, application }) => {
      const { headers } = await setupUser()
      const { user: other } = await setupUser()
      const response = await application.fetch(`/api/users/${other.username}?withDeleted=true`, { headers })
      const body = await response.json() as Record<string, string>
      expect(response).toMatchObject({ status: 403, statusText: 'Forbidden' })
      expect(body).toMatchObject({ data: { name: 'E_USER_FORBIDDEN' } })
    })
  })

  describe<Context>('with unauthenticated user', (it) => {
    it('should return with E_USER_UNAUTHORIZED if the user exists but the request is not authenticated', async({ setupUser, application }) => {
      const { user } = await setupUser()
      const response = await application.fetch(`/api/users/${user.username}`)
      const body = await response.json() as Record<string, string>
      expect(response).toMatchObject({ status: 401, statusText: 'Unauthorized' })
      expect(body).toMatchObject({ data: { name: 'E_USER_UNAUTHORIZED' } })
    })

    it('should return with E_USER_UNAUTHORIZED if the user does not exist', async({ application }) => {
      const response = await application.fetch('/api/users/does-not-exists')
      const body = await response.json() as Record<string, string>
      expect(response).toMatchObject({ status: 401, statusText: 'Unauthorized' })
      expect(body).toMatchObject({ data: { name: 'E_USER_UNAUTHORIZED' } })
    })
  })
})
