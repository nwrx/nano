/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import { createTestContext } from '../../__fixtures__'

describe.concurrent('userEnable', () => {
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
      await createUser('jdoe', { email: 'jdoe@example.com', disabledAt: new Date() })
      const response = await application.fetch('/api/users/jdoe/enable', { method: 'PATCH', headers })
      expect(response.status).toBe(204)
      expect(response.statusText).toBe('No Content')
    })

    it('should enable the user in the database', async({ createUser, moduleUser, application }) => {
      const { headers } = await createUser('admin', { isSuperAdministrator: true })
      await createUser('jdoe', { email: 'jdoe@example.com', disabledAt: new Date() })
      await application.fetch('/api/users/jdoe/enable', { method: 'PATCH', headers })
      const { User } = moduleUser.getRepositories()
      const result = await User.findOneOrFail({ where: { username: 'jdoe' }, withDeleted: true })
      expect(result).toMatchObject({ username: 'jdoe', disabledAt: undefined })
    })

    it('should respond with a USER_ALREADY_ENABLED error if the user is already enabled', async({ createUser, application }) => {
      const { headers } = await createUser('admin', { isSuperAdministrator: true })
      await createUser('jdoe', { email: 'jdoe@example.com' })
      const response = await application.fetch('/api/users/jdoe/enable', { method: 'PATCH', headers })
      const data = await response.json() as Record<string, string>
      expect(response.status).toBe(409)
      expect(data).toMatchObject({ data: { name: 'E_USER_ALREADY_ENABLED' } })
    })
  })

  describe<Context>('with authenticated user', (it) => {
    it('should not enable the user in the database', async({ createUser, moduleUser, application }) => {
      const { headers } = await createUser('jdoe')
      await createUser('paul', { disabledAt: new Date() })
      await application.fetch('/api/users/paul/enable', { method: 'PATCH', headers })
      const { User } = moduleUser.getRepositories()
      const result = await User.findOneOrFail({ where: { username: 'paul' }, withDeleted: true })
      expect(result).toMatchObject({ username: 'paul', disabledAt: expect.any(Date) })
    })

    it('should respond with a USER_NOT_ALLOWED error', async({ createUser, application }) => {
      const { headers } = await createUser('jdoe')
      await createUser('paul', { disabledAt: new Date() })
      const response = await application.fetch('/api/users/paul/enable', { method: 'PATCH', headers })
      const data = await response.json() as Record<string, string>
      expect(response.status).toBe(403)
      expect(data).toMatchObject({ data: { name: 'E_USER_NOT_ALLOWED' } })
    })
  })

  describe<Context>('with unauthenticated user', (it) => {
    it('should not enable the user in the database', async({ createUser, moduleUser, application }) => {
      await createUser('jdoe', { disabledAt: new Date() })
      await application.fetch('/api/users/jdoe/enable', { method: 'PATCH' })
      const { User } = moduleUser.getRepositories()
      const result = await User.findOneOrFail({ where: { username: 'jdoe' }, withDeleted: true })
      expect(result).toMatchObject({ username: 'jdoe', disabledAt: expect.any(Date) })
    })

    it('should respond with a USER_NOT_AUTHENTICATED error', async({ application }) => {
      const response = await application.fetch('/api/users/jdoe/enable', { method: 'PATCH' })
      const data = await response.json() as Record<string, string>
      expect(response.status).toBe(401)
      expect(data).toMatchObject({ data: { name: 'E_USER_NOT_AUTHENTICATED' } })
    })
  })
}, 1000)
