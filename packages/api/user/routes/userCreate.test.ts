/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import { createTestContext } from '../../__fixtures__'
import { Workspace } from '../../workspace'

describe.concurrent('userCreate', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
    await context.application.createTestServer()
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  describe<Context>('with super administrator', (it) => {
    it('should respond with status 201', async({ createUser, application }) => {
      const { headers } = await createUser('admin', { isSuperAdministrator: true })
      const body = JSON.stringify({ email: 'jdoe@example.com', username: 'jdoe' })
      const response = await application.fetch('/api/users', { method: 'POST', body, headers })
      expect(response.status).toBe(201)
      expect(response.statusText).toBe('Created')
    })

    it('should respond with the user object', async({ createUser, application }) => {
      const { headers } = await createUser('admin', { isSuperAdministrator: true })
      const body = JSON.stringify({ email: 'jdoe@example.com', username: 'jdoe' })
      const response = await application.fetch('/api/users', { method: 'POST', body, headers })
      const data = await response.json() as Record<string, string>
      expect(data).toMatchObject({ username: 'jdoe' })
    })

    it('should create a user in the database', async({ createUser, moduleUser, application }) => {
      const { headers } = await createUser('admin', { isSuperAdministrator: true })
      const body = JSON.stringify({ email: 'jdoe@example.com', username: 'jdoe' })
      await application.fetch('/api/users', { method: 'POST', body, headers })
      const result = await moduleUser.getRepositories().User.find()
      expect(result).toHaveLength(2)
      expect(result[1]).toMatchObject({
        isSuperAdministrator: null,
        username: 'jdoe',
        email: 'jdoe@example.com',
        verifiedAt: undefined,
        disabledAt: undefined,
        deletedAt: undefined,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    })

    it('should not create a password for the user', async({ createUser, moduleUser, application }) => {
      const { headers } = await createUser('admin', { isSuperAdministrator: true })
      const body = JSON.stringify({ email: 'jdoe@example.com', username: 'jdoe' })
      await application.fetch('/api/users', { method: 'POST', body, headers })
      const result = await moduleUser.getRepositories().User.find({ relations: { passwords: true } })
      expect(result[1].passwords).toHaveLength(0)
    })

    it('should create a profile for the user', async({ createUser, moduleUser, application }) => {
      const { headers } = await createUser('admin', { isSuperAdministrator: true })
      const body = JSON.stringify({ email: 'jdoe@example.com', username: 'jdoe' })
      await application.fetch('/api/users', { method: 'POST', body, headers })
      const result = await moduleUser.getRepositories().UserProfile.findOneBy({ displayName: 'jdoe' })
      expect(result).toMatchObject({
        displayName: 'jdoe',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    })

    it('should create a public workspace for the user', async({ createUser, moduleWorkspace, application }) => {
      const { headers } = await createUser('admin', { isSuperAdministrator: true })
      const body = JSON.stringify({ email: 'jdoe@example.com', username: 'jdoe' })
      await application.fetch('/api/users', { method: 'POST', body, headers })
      const [result] = await moduleWorkspace.getRepositories().Workspace.findBy({ name: 'jdoe' })
      expect(result).toBeInstanceOf(Workspace)
    })

    it('should create a workspace assignment for the user', async({ createUser, moduleWorkspace, application }) => {
      const { headers } = await createUser('admin', { isSuperAdministrator: true })
      const body = JSON.stringify({ email: 'jdoe@example.com', username: 'jdoe' })
      await application.fetch('/api/users', { method: 'POST', body, headers })
      const { Workspace } = moduleWorkspace.getRepositories()
      const result = await Workspace.find({ relations: { assignments: { user: true } } })
      expect(result[1].assignments).toHaveLength(1)
      expect(result[1].assignments![0]).toMatchObject({
        permission: 'Owner',
        user: { username: 'jdoe' },
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    })

    it('should respond with a E_USER_EMAIL_OR_NAME_TAKEN error if the email is already taken', async({ createUser, application }) => {
      await createUser('jdoe', { email: 'jdoe@example.com' })
      const { headers } = await createUser('admin', { isSuperAdministrator: true })
      const body = JSON.stringify({ email: 'jdoe@example.com', username: 'not-jdoe' })
      const response = await application.fetch('/api/users', { method: 'POST', body, headers })
      const data = await response.json() as Record<string, string>
      expect(response.status).toBe(409)
      expect(data).toMatchObject({ data: { name: 'E_USER_EMAIL_OR_NAME_TAKEN' } })
    })

    it('should respond with a E_USER_EMAIL_OR_NAME_TAKEN error if the username is already taken', async({ createUser, application }) => {
      await createUser('jdoe')
      const { headers } = await createUser('admin', { isSuperAdministrator: true })
      const body = JSON.stringify({ email: 'not-jdoe@example.com', username: 'jdoe' })
      const response = await application.fetch('/api/users', { method: 'POST', body, headers })
      const data = await response.json() as Record<string, string>
      expect(response.status).toBe(409)
      expect(data).toMatchObject({ data: { name: 'E_USER_EMAIL_OR_NAME_TAKEN' } })
    })
  })

  describe<Context>('with authenticated user', (it) => {
    it('should not create a user in the database', async({ createUser, moduleUser, application }) => {
      const { headers } = await createUser('jdoe')
      const body = JSON.stringify({ email: 'paul@example.com', username: 'paul' })
      await application.fetch('/api/users', { method: 'POST', body, headers })
      const result = await moduleUser.getRepositories().User.findOneBy({ username: 'paul' })
      expect(result).toBeNull()
    })

    it('should respond with a E_USER_FORBIDDEN error', async({ createUser, application }) => {
      const { headers } = await createUser('jdoe')
      const body = JSON.stringify({ email: 'paul@example.com', username: 'paul' })
      const response = await application.fetch('/api/users', { method: 'POST', body, headers })
      const data = await response.json() as Record<string, string>
      expect(response.status).toBe(403)
      expect(data).toMatchObject({ data: { name: 'E_USER_FORBIDDEN' } })
    })

    it('should respond with a E_USER_FORBIDDEN error if the email is already taken', async({ createUser, application }) => {
      await createUser('paul', { email: 'paul@example.com' })
      const { headers } = await createUser('jdoe')
      const body = JSON.stringify({ email: 'paul@example.com', username: 'not-paul' })
      const response = await application.fetch('/api/users', { method: 'POST', body, headers })
      const data = await response.json() as Record<string, string>
      expect(response.status).toBe(403)
      expect(data).toMatchObject({ data: { name: 'E_USER_FORBIDDEN' } })
    })

    it('should respond with a E_USER_FORBIDDEN error if the username is already taken', async({ createUser, application }) => {
      await createUser('paul', { email: 'paul@example.com' })
      const { headers } = await createUser('jdoe')
      const body = JSON.stringify({ email: 'not-paul@example.com', username: 'paul' })
      const response = await application.fetch('/api/users', { method: 'POST', body, headers })
      const data = await response.json() as Record<string, string>
      expect(response.status).toBe(403)
      expect(data).toMatchObject({ data: { name: 'E_USER_FORBIDDEN' } })
    })
  })

  describe<Context>('with unauthenticated user', (it) => {
    it('should not create a user in the database', async({ moduleUser, application }) => {
      const body = JSON.stringify({ email: 'paul@example.com', username: 'paul' })
      await application.fetch('/api/users', { method: 'POST', body })
      const result = await moduleUser.getRepositories().User.findOneBy({ username: 'paul' })
      expect(result).toBeNull()
    })

    it('should respond with a E_USER_UNAUTHORIZED error', async({ application }) => {
      const body = JSON.stringify({ email: 'paul@example.com', username: 'paul' })
      const response = await application.fetch('/api/users', { method: 'POST', body })
      const data = await response.json() as Record<string, string>
      expect(response.status).toBe(401)
      expect(data).toMatchObject({ data: { name: 'E_USER_UNAUTHORIZED' } })
    })
  })
}, 1000)
