/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import { createTestContext } from '../../__fixtures__'

describe.concurrent('userVerify', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
    await context.application.createTestServer()
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  describe<Context>('with super administrator', (it) => {
    it('should respond with status 204', async({ createUser, application }) => {
      const { headers } = await createUser('admin', { isSuperAdministrator: true })
      await createUser('jdoe', { email: 'jdoe@example.com' })
      const response = await application.fetch('/api/users/jdoe/verify', { method: 'PATCH', headers })
      expect(response.status).toBe(204)
      expect(response.statusText).toBe('No Content')
    })

    it('should verify the user in the database', async({ createUser, moduleUser, application }) => {
      const { headers } = await createUser('admin', { isSuperAdministrator: true })
      await createUser('jdoe', { email: 'jdoe@example.com' })
      await application.fetch('/api/users/jdoe/verify', { method: 'PATCH', headers })
      const { User } = moduleUser.getRepositories()
      const result = await User.findOneOrFail({ where: { username: 'jdoe' }, withDeleted: true })
      expect(result).toMatchObject({ username: 'jdoe', verifiedAt: expect.any(Date) })
    })

    it('should respond with a USER_ALREADY_VERIFIED error if the user is already verified', async({ createUser, application }) => {
      const { headers } = await createUser('admin', { isSuperAdministrator: true })
      await createUser('jdoe', { email: 'jdoe@example.com', verifiedAt: new Date() })
      const response = await application.fetch('/api/users/jdoe/verify', { method: 'PATCH', headers })
      const data = await response.json() as Record<string, string>
      expect(response.status).toBe(409)
      expect(data).toMatchObject({ data: { name: 'E_USER_ALREADY_VERIFIED' } })
    })

    it('should verify disabled users', async({ createUser, moduleUser, application }) => {
      const { headers } = await createUser('admin', { isSuperAdministrator: true })
      await createUser('jdoe', { email: 'jdoe@example.com', disabledAt: new Date() })
      await application.fetch('/api/users/jdoe/verify', { method: 'PATCH', headers })
      const { User } = moduleUser.getRepositories()
      const result = await User.findOneOrFail({ where: { username: 'jdoe' }, withDeleted: true })
      expect(result).toMatchObject({ username: 'jdoe', verifiedAt: expect.any(Date) })
    })
  })

  describe<Context>('with authenticated user', (it) => {
    it('should not verify the user in the database', async({ createUser, moduleUser, application }) => {
      const { headers } = await createUser('jdoe')
      await createUser('paul')
      await application.fetch('/api/users/paul/verify', { method: 'PATCH', headers })
      const { User } = moduleUser.getRepositories()
      const result = await User.findOneOrFail({ where: { username: 'paul' }, withDeleted: true })
      expect(result).toMatchObject({ username: 'paul', verifiedAt: undefined })
    })

    it('should respond with a USER_FORBIDDEN error', async({ createUser, application }) => {
      const { headers } = await createUser('jdoe')
      await createUser('paul')
      const response = await application.fetch('/api/users/paul/verify', { method: 'PATCH', headers })
      const data = await response.json() as Record<string, string>
      expect(response.status).toBe(403)
      expect(data).toMatchObject({ data: { name: 'E_USER_FORBIDDEN' } })
    })
  })

  describe<Context>('with unauthenticated user', (it) => {
    it('should not verify the user in the database', async({ createUser, moduleUser, application }) => {
      await createUser('jdoe')
      await application.fetch('/api/users/jdoe/verify', { method: 'PATCH' })
      const { User } = moduleUser.getRepositories()
      const result = await User.findOneOrFail({ where: { username: 'jdoe' }, withDeleted: true })
      expect(result).toMatchObject({ username: 'jdoe', verifiedAt: undefined })
    })

    it('should respond with a USER_UNAUTHORIZED error', async({ application }) => {
      const response = await application.fetch('/api/users/jdoe/verify', { method: 'PATCH' })
      const data = await response.json() as Record<string, string>
      expect(response.status).toBe(401)
      expect(data).toMatchObject({ data: { name: 'E_USER_UNAUTHORIZED' } })
    })
  })
}, 1000)
