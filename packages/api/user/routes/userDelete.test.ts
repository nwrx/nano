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
    it('should respond with status 204', async({ expect, ctx }) => {
      const { headers } = await ctx.createUser('admin', { isSuperAdministrator: true })
      await ctx.createUser('jdoe', { email: 'jdoe@example.com' })
      const response = await ctx.fetch('/api/users/jdoe', { method: 'DELETE', headers })
      expect(response.status).toBe(204)
      expect(response.statusText).toBe('No Content')
    })

    it('should respond with an empty body', async({ expect, ctx }) => {
      const { headers } = await ctx.createUser('admin', { isSuperAdministrator: true })
      await ctx.createUser('jdoe', { email: 'jdoe@example.com' })
      const response = await ctx.fetch('/api/users/jdoe', { method: 'DELETE', headers })
      const data = await response.text()
      expect(data).toBe('')
      expect(response.headers.get('content-type')).toBe(null)
      expect(response.headers.get('content-length')).toBe(null)
    })

    it('should soft remove the user from the database', async({ expect, ctx }) => {
      const { headers } = await ctx.createUser('admin', { isSuperAdministrator: true })
      await ctx.createUser('jdoe', { email: 'jdoe@example.com' })
      await ctx.fetch('/api/users/jdoe', { method: 'DELETE', headers })
      const { User } = ctx.ModuleUser.getRepositories()
      const result = await User.findOneOrFail({ where: { username: 'jdoe' }, withDeleted: true })
      expect(result).toMatchObject({ username: 'jdoe', deletedAt: expect.any(Date) })
    })

    it('should soft remove the user workspace', async({ expect, ctx }) => {
      const { headers } = await ctx.createUser('admin', { isSuperAdministrator: true })
      await ctx.createUser('jdoe', { email: 'jdoe@example.com' })
      await ctx.fetch('/api/users/jdoe', { method: 'DELETE', headers })
      const { Workspace } = ctx.ModuleWorkspace.getRepositories()
      const result = await Workspace.findOneOrFail({ where: { name: 'jdoe' }, withDeleted: true })
      expect(result).toMatchObject({ name: 'jdoe', deletedAt: expect.any(Date) })
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
    it('should not soft remove the user from the database', async({ expect, ctx }) => {
      const { headers } = await ctx.createUser('jdoe')
      await ctx.createUser('paul', { email: 'paul@example.com' })
      await ctx.fetch('/api/users/paul', { method: 'DELETE', headers })
      const { User } = ctx.ModuleUser.getRepositories()
      const result = await User.find()
      expect(result).toHaveLength(2)
    })

    it('should respond with a E_USER_NOT_ALLOWED error', async({ expect, ctx }) => {
      const { headers } = await ctx.createUser('jdoe')
      await ctx.createUser('paul', { email: 'paul@example.com' })
      const response = await ctx.fetch('/api/users/paul', { method: 'DELETE', headers })
      const data = await response.json() as Record<string, string>
      expect(response.status).toBe(403)
      expect(data).toMatchObject({ data: { name: 'E_USER_NOT_ALLOWED' } })
    })
  })

  describe<Context>('with unauthenticated user', (it) => {
    it('should respond with a E_USER_NOT_AUTHENTICATED error', async({ expect, ctx }) => {
      await ctx.createUser('paul', { email: 'paul@example.com' })
      const response = await ctx.fetch('/api/users/jdoe', { method: 'DELETE' })
      const data = await response.json() as Record<string, string>
      expect(response.status).toBe(401)
      expect(data).toMatchObject({ data: { name: 'E_USER_NOT_AUTHENTICATED' } })
    })
  })
})
