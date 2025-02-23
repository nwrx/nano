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

  describe<Context>('with super administrator', (it) => {
    it('should soft delete the user and archive workspace', async({ setupUser, moduleUser, moduleWorkspace, application }) => {
      const { headers } = await setupUser({ isSuperAdministrator: true })
      const { user } = await setupUser()
      const response = await application.fetch(`/api/users/${user.username}`, { method: 'DELETE', headers })
      expect(response).toMatchObject({ status: 204, statusText: 'No Content' })

      // Check user is soft deleted
      const { User } = moduleUser.getRepositories()
      const deletedUser = await User.findOne({ where: { username: user.username }, withDeleted: true })
      expect(deletedUser?.deletedAt).toBeInstanceOf(Date)

      // Check workspace is archived
      const { Workspace } = moduleWorkspace.getRepositories()
      const workspace = await Workspace.findOneByOrFail({ name: user.username })
      expect(workspace.archivedAt).toBeInstanceOf(Date)
    })

    it('should not allow super admin to delete themselves', async({ setupUser, moduleUser, application }) => {
      const { headers, user } = await setupUser({ isSuperAdministrator: true })
      const response = await application.fetch(`/api/users/${user.username}`, { method: 'DELETE', headers })
      const data = await response.json() as Record<string, string>
      expect(response).toMatchObject({ status: 403, statusText: 'Forbidden' })
      expect(data).toMatchObject({ data: { name: 'E_USER_UNABLE_TO_DELETE_SUPER_ADMIN' } })

      // Check database
      const { User } = moduleUser.getRepositories()
      const result = await User.findOneByOrFail({ username: user.username })
      expect(result.deletedAt).toBeUndefined()
    })
  })

  describe<Context>('with authenticated user', (it) => {
    it('should allow users to delete themselves', async({ setupUser, moduleUser, moduleWorkspace, application }) => {
      const { headers, user } = await setupUser()
      const response = await application.fetch(`/api/users/${user.username}`, { method: 'DELETE', headers })
      expect(response).toMatchObject({ status: 204, statusText: 'No Content' })

      // Check user is soft deleted
      const { User } = moduleUser.getRepositories()
      const deletedUser = await User.findOne({ where: { username: user.username }, withDeleted: true })
      expect(deletedUser?.deletedAt).toBeInstanceOf(Date)

      // Check workspace is archived
      const { Workspace } = moduleWorkspace.getRepositories()
      const workspace = await Workspace.findOneByOrFail({ name: user.username })
      expect(workspace.archivedAt).toBeInstanceOf(Date)
    })

    it('should not allow users to delete other users', async({ setupUser, moduleUser, application }) => {
      const { headers } = await setupUser()
      const { user: otherUser } = await setupUser()
      const response = await application.fetch(`/api/users/${otherUser.username}`, { method: 'DELETE', headers })
      const data = await response.json() as Record<string, string>
      expect(response).toMatchObject({ status: 403, statusText: 'Forbidden' })
      expect(data).toMatchObject({ data: { name: 'E_USER_FORBIDDEN' } })

      // Check database
      const { User } = moduleUser.getRepositories()
      const result = await User.findOneByOrFail({ username: otherUser.username })
      expect(result.deletedAt).toBeUndefined()
    })
  })

  describe<Context>('with unauthenticated user', (it) => {
    it('should not delete the user', async({ setupUser, moduleUser, application }) => {
      const { user } = await setupUser()
      const response = await application.fetch(`/api/users/${user.username}`, { method: 'DELETE' })
      const data = await response.json() as Record<string, string>
      expect(response).toMatchObject({ status: 401, statusText: 'Unauthorized' })
      expect(data).toMatchObject({ data: { name: 'E_USER_UNAUTHORIZED' } })

      // Check database
      const { User } = moduleUser.getRepositories()
      const result = await User.findOneByOrFail({ username: user.username })
      expect(result.deletedAt).toBeUndefined()
    })
  })
})
