/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import { createTestContext } from '../../__fixtures__'

describe.concurrent('userDisable', () => {
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
      const response = await application.fetch('/api/users/jdoe/disable', { method: 'PATCH', headers })
      expect(response.status).toBe(204)
      expect(response.statusText).toBe('No Content')
    })

    it('should disable the user in the database', async({ createUser, moduleUser, application }) => {
      const { headers } = await createUser('admin', { isSuperAdministrator: true })
      await createUser('jdoe', { email: 'jdoe@example.com' })
      await application.fetch('/api/users/jdoe/disable', { method: 'PATCH', headers })
      const { User } = moduleUser.getRepositories()
      const result = await User.findOneOrFail({ where: { username: 'jdoe' }, withDeleted: true })
      expect(result).toMatchObject({ username: 'jdoe', disabledAt: expect.any(Date) })
    })

    it('should respond with a USER_ALREADY_DISABLED error if the user is already disabled', async({ createUser, application }) => {
      const { headers } = await createUser('admin', { isSuperAdministrator: true })
      await createUser('jdoe', { email: 'jdoe@example.com', disabledAt: new Date() })
      const response = await application.fetch('/api/users/jdoe/disable', { method: 'PATCH', headers })
      const data = await response.json() as Record<string, string>
      expect(response.status).toBe(409)
      expect(response.statusText).toBe('Conflict')
      expect(data).toMatchObject({ data: { name: 'E_USER_ALREADY_DISABLED' } })
    })
  })

  describe<Context>('with authenticated user', (it) => {
    it('should not disable the user in the database', async({ createUser, moduleUser, application }) => {
      const { headers } = await createUser('jdoe')
      await createUser('paul')
      await application.fetch('/api/users/paul/disable', { method: 'PATCH', headers })
      const { User } = moduleUser.getRepositories()
      const result = await User.findOneOrFail({ where: { username: 'paul' }, withDeleted: true })
      expect(result).toMatchObject({ username: 'paul', disabledAt: undefined })
    })

    it('should respond with a USER_FORBIDDEN error', async({ createUser, application }) => {
      const { headers } = await createUser('jdoe')
      await createUser('paul')
      const response = await application.fetch('/api/users/paul/disable', { method: 'PATCH', headers })
      const data = await response.json() as Record<string, string>
      expect(response.status).toBe(403)
      expect(data).toMatchObject({ data: { name: 'E_USER_FORBIDDEN' } })
    })
  })

  describe<Context>('with unauthenticated user', (it) => {
    it('should not disable the user in the database', async({ createUser, moduleUser, application }) => {
      await createUser('jdoe')
      await createUser('paul')
      await application.fetch('/api/users/paul/disable', { method: 'PATCH' })
      const { User } = moduleUser.getRepositories()
      const result = await User.findOneOrFail({ where: { username: 'paul' }, withDeleted: true })
      expect(result).toMatchObject({ username: 'paul', disabledAt: undefined })
    })

    it('should respond with a USER_UNAUTHORIZED error', async({ application }) => {
      const response = await application.fetch('/api/users/jdoe/disable', { method: 'PATCH' })
      const data = await response.json() as Record<string, string>
      expect(response.status).toBe(401)
      expect(data).toMatchObject({ data: { name: 'E_USER_UNAUTHORIZED' } })
    })
  })
}, 1000)
