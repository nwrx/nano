/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import { createTestContext } from '../../__fixtures__'

describe.concurrent('userDelete', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
    await context.application.createTestServer()
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  describe<Context>('with super administrator', () => {
    describe<Context>('own user', (it) => {
      it('should respond with an error if the user is the super administrator', async({ createUser, application }) => {
        const { headers } = await createUser('admin', { isSuperAdministrator: true })
        const response = await application.fetch('/api/users/admin', { method: 'DELETE', headers })
        const data = await response.json() as Record<string, string>
        expect(response.status).toBe(403)
        expect(response.statusText).toBe('Forbidden')
        expect(data).toMatchObject({ data: { name: 'E_USER_UNABLE_TO_DELETE_SUPER_ADMIN' } })
      })
    })

    describe<Context>('other user', (it) => {
      it('should soft remove the user from the database', async({ createUser, moduleUser, application }) => {
        const { headers } = await createUser('admin', { isSuperAdministrator: true })
        await createUser('jdoe')
        const response = await application.fetch('/api/users/jdoe', { method: 'DELETE', headers })
        const { User } = moduleUser.getRepositories()
        const result = await User.findOneOrFail({ where: { username: 'jdoe' }, withDeleted: true })
        expect(response.status).toBe(204)
        expect(response.statusText).toBe('No Content')
        expect(result).toMatchObject({ username: 'jdoe', deletedAt: expect.any(Date) })
      })

      it('should archive the user workspace', async({ createUser, moduleWorkspace, application }) => {
        const { headers } = await createUser('admin', { isSuperAdministrator: true })
        await createUser('jdoe')
        const response = await application.fetch('/api/users/jdoe', { method: 'DELETE', headers })
        const { Workspace } = moduleWorkspace.getRepositories()
        const result = await Workspace.findOneOrFail({ where: { name: 'jdoe' }, withDeleted: true })
        expect(response.status).toBe(204)
        expect(response.statusText).toBe('No Content')
        expect(result).toMatchObject({ name: 'jdoe', deletedAt: undefined, archivedAt: expect.any(Date) })
      })
    })

    describe<Context>('edge cases', (it) => {
      it('should remove disabled users', async({ createUser, moduleUser, application }) => {
        const { headers } = await createUser('admin', { isSuperAdministrator: true })
        await createUser('jdoe', { disabledAt: new Date() })
        const response = await application.fetch('/api/users/jdoe', { method: 'DELETE', headers })
        const { User } = moduleUser.getRepositories()
        const result = await User.findOneOrFail({ where: { username: 'jdoe' }, withDeleted: true })
        expect(response.status).toBe(204)
        expect(response.statusText).toBe('No Content')
        expect(result).toMatchObject({ username: 'jdoe', deletedAt: expect.any(Date) })
      })

      it('should respond with a error if the user does not exist', async({ createUser, application }) => {
        const { headers } = await createUser('admin', { isSuperAdministrator: true })
        const response = await application.fetch('/api/users/jdoe', { method: 'DELETE', headers })
        const data = await response.json() as Record<string, string>
        expect(response.status).toBe(404)
        expect(response.statusText).toBe('Not Found')
        expect(data).toMatchObject({ data: { name: 'E_USER_NOT_FOUND' } })
      })
    })
  })

  describe<Context>('with authenticated user', () => {
    describe<Context>('own user', (it) => {
      it('should soft remove the user from the database', async({ createUser, moduleUser, application }) => {
        const { headers } = await createUser('jdoe')
        const response = await application.fetch('/api/users/jdoe', { method: 'DELETE', headers })
        const { User } = moduleUser.getRepositories()
        const result = await User.findOneOrFail({ where: { username: 'jdoe' }, withDeleted: true })
        expect(response.status).toBe(204)
        expect(response.statusText).toBe('No Content')
        expect(result).toMatchObject({ username: 'jdoe', deletedAt: expect.any(Date) })
      })
    })

    describe<Context>('other user', (it) => {
      it('should not soft remove the user from the database', async({ createUser, moduleUser, application }) => {
        const { headers } = await createUser('jdoe')
        await createUser('paul')
        const response = await application.fetch('/api/users/paul', { method: 'DELETE', headers })
        const { User } = moduleUser.getRepositories()
        const result = await User.findOneOrFail({ where: { username: 'paul' }, withDeleted: true })
        const data = await response.json() as Record<string, string>
        expect(response.status).toBe(403)
        expect(response.statusText).toBe('Forbidden')
        expect(result).toMatchObject({ username: 'paul' })
        expect(data).toMatchObject({ data: { name: 'E_USER_FORBIDDEN' } })
      })
    })
  })

  describe<Context>('with unauthenticated user', (it) => {
    it('should not soft remove the user from the database', async({ createUser, moduleUser, application }) => {
      await createUser('jdoe')
      const response = await application.fetch('/api/users/jdoe', { method: 'DELETE' })
      const data = await response.json() as Record<string, string>
      const { User } = moduleUser.getRepositories()
      const result = await User.findOneByOrFail({ username: 'jdoe' })
      expect(response.status).toBe(401)
      expect(response.statusText).toBe('Unauthorized')
      expect(data).toMatchObject({ data: { name: 'E_USER_UNAUTHORIZED' } })
      expect(result).toMatchObject({ username: 'jdoe' })
    })
  })
}, 1000)
