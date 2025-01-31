/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable unicorn/no-null */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import { createContext } from '../../__fixtures__'

describe.concurrent<Context>('userCreate', () => {
  beforeEach<Context>(async(context) => {
    context.ctx = await createContext()
    await context.ctx.createServer()
  })

  afterEach<Context>(async(context) => {
    await context.ctx.destroy()
  })

  describe<Context>('with super administrator', (it) => {
    it('should respond with status 201', async({ expect, ctx }) => {
      const { headers } = await ctx.createUser('admin', { isSuperAdministrator: true })
      const body = JSON.stringify({ email: 'jdoe@example.com', username: 'jdoe' })
      const response = await ctx.fetch('/api/users', { method: 'POST', body, headers })
      expect(response.status).toBe(201)
      expect(response.statusText).toBe('Created')
    })

    it('should respond with the user object', async({ expect, ctx }) => {
      const { headers } = await ctx.createUser('admin', { isSuperAdministrator: true })
      const body = JSON.stringify({ email: 'jdoe@example.com', username: 'jdoe' })
      const response = await ctx.fetch('/api/users', { method: 'POST', body, headers })
      const data = await response.json() as Record<string, string>
      expect(data).toMatchObject({ username: 'jdoe' })
    })

    it('should create a user in the database', async({ expect, ctx }) => {
      const { headers } = await ctx.createUser('admin', { isSuperAdministrator: true })
      const body = JSON.stringify({ email: 'jdoe@example.com', username: 'jdoe' })
      await ctx.fetch('/api/users', { method: 'POST', body, headers })
      const { User } = ctx.ModuleUser.getRepositories()
      const result = await User.find()
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

    it('should not create a password for the user', async({ expect, ctx }) => {
      const { headers } = await ctx.createUser('admin', { isSuperAdministrator: true })
      const body = JSON.stringify({ email: 'jdoe@example.com', username: 'jdoe' })
      await ctx.fetch('/api/users', { method: 'POST', body, headers })
      const { User } = ctx.ModuleUser.getRepositories()
      const result = await User.find({ relations: { passwords: true } })
      expect(result[1].passwords).toHaveLength(0)
    })

    it('should create a profile for the user', async({ expect, ctx }) => {
      const { headers } = await ctx.createUser('admin', { isSuperAdministrator: true })
      const body = JSON.stringify({ email: 'jdoe@example.com', username: 'jdoe' })
      await ctx.fetch('/api/users', { method: 'POST', body, headers })
      const { User } = ctx.ModuleUser.getRepositories()
      const result = await User.find({ relations: { profile: true } })
      expect(result[1].profile).toMatchObject({
        displayName: 'jdoe',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    })

    it('should create a public workspace for the user', async({ expect, ctx }) => {
      const { headers } = await ctx.createUser('admin', { isSuperAdministrator: true })
      const body = JSON.stringify({ email: 'jdoe@example.com', username: 'jdoe' })
      await ctx.fetch('/api/users', { method: 'POST', body, headers })
      const { Workspace } = ctx.ModuleWorkspace.getRepositories()
      const result = await Workspace.find()
      expect(result).toHaveLength(2)
      expect(result[1]).toMatchObject({
        name: 'jdoe',
        isPublic: true,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    })

    it('should create a workspace assignment for the user', async({ expect, ctx }) => {
      const { headers } = await ctx.createUser('admin', { isSuperAdministrator: true })
      const body = JSON.stringify({ email: 'jdoe@example.com', username: 'jdoe' })
      await ctx.fetch('/api/users', { method: 'POST', body, headers })
      const { Workspace } = ctx.ModuleWorkspace.getRepositories()
      const result = await Workspace.find({ relations: { assignments: { user: true } } })
      expect(result[1].assignments).toHaveLength(1)
      expect(result[1].assignments[0]).toMatchObject({
        permission: 'Owner',
        user: { username: 'jdoe' },
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    })

    it('should respond with a E_USER_EMAIL_OR_NAME_TAKEN error if the email is already taken', async({ expect, ctx }) => {
      await ctx.createUser('jdoe', { email: 'jdoe@example.com' })
      const { headers } = await ctx.createUser('admin', { isSuperAdministrator: true })
      const body = JSON.stringify({ email: 'jdoe@example.com', username: 'not-jdoe' })
      const response = await ctx.fetch('/api/users', { method: 'POST', body, headers })
      const data = await response.json() as Record<string, string>
      expect(response.status).toBe(409)
      expect(data).toMatchObject({ data: { name: 'E_USER_EMAIL_OR_NAME_TAKEN' } })
    })

    it('should respond with a E_USER_EMAIL_OR_NAME_TAKEN error if the username is already taken', async({ expect, ctx }) => {
      await ctx.createUser('jdoe')
      const { headers } = await ctx.createUser('admin', { isSuperAdministrator: true })
      const body = JSON.stringify({ email: 'not-jdoe@example.com', username: 'jdoe' })
      const response = await ctx.fetch('/api/users', { method: 'POST', body, headers })
      const data = await response.json() as Record<string, string>
      expect(response.status).toBe(409)
      expect(data).toMatchObject({ data: { name: 'E_USER_EMAIL_OR_NAME_TAKEN' } })
    })
  })

  describe<Context>('with authenticated user', (it) => {
    it('should not create a user in the database', async({ expect, ctx }) => {
      const { headers } = await ctx.createUser('jdoe')
      const body = JSON.stringify({ email: 'paul@example.com', username: 'paul' })
      await ctx.fetch('/api/users', { method: 'POST', body, headers })
      const { User } = ctx.ModuleUser.getRepositories()
      const result = await User.find()
      expect(result).toHaveLength(1)
    })

    it('should respond with a E_USER_NOT_ALLOWED error', async({ expect, ctx }) => {
      const { headers } = await ctx.createUser('jdoe')
      const body = JSON.stringify({ email: 'paul@example.com', username: 'paul' })
      const response = await ctx.fetch('/api/users', { method: 'POST', body, headers })
      const data = await response.json() as Record<string, string>
      expect(response.status).toBe(403)
      expect(data).toMatchObject({ data: { name: 'E_USER_NOT_ALLOWED' } })
    })

    it('should respond with a E_USER_NOT_ALLOWED error if the email is already taken', async({ expect, ctx }) => {
      await ctx.createUser('paul', { email: 'paul@example.com' })
      const { headers } = await ctx.createUser('jdoe')
      const body = JSON.stringify({ email: 'paul@example.com', username: 'not-paul' })
      const response = await ctx.fetch('/api/users', { method: 'POST', body, headers })
      const data = await response.json() as Record<string, string>
      expect(response.status).toBe(403)
      expect(data).toMatchObject({ data: { name: 'E_USER_NOT_ALLOWED' } })
    })

    it('should respond with a E_USER_NOT_ALLOWED error if the username is already taken', async({ expect, ctx }) => {
      await ctx.createUser('paul', { email: 'paul@example.com' })
      const { headers } = await ctx.createUser('jdoe')
      const body = JSON.stringify({ email: 'not-paul@example.com', username: 'paul' })
      const response = await ctx.fetch('/api/users', { method: 'POST', body, headers })
      const data = await response.json() as Record<string, string>
      expect(response.status).toBe(403)
      expect(data).toMatchObject({ data: { name: 'E_USER_NOT_ALLOWED' } })
    })
  })

  describe<Context>('with unauthenticated user', (it) => {
    it('should respond with a E_USER_NOT_AUTHENTICATED error', async({ expect, ctx }) => {
      const body = JSON.stringify({ email: 'paul@example.com', username: 'paul' })
      const response = await ctx.fetch('/api/users', { method: 'POST', body })
      const data = await response.json() as Record<string, string>
      expect(response.status).toBe(401)
      expect(data).toMatchObject({ data: { name: 'E_USER_NOT_AUTHENTICATED' } })
    })
  })
})
