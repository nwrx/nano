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
    it('should verify the user in the database', async({ setupUser, moduleUser, application }) => {
      const { headers } = await setupUser({ isSuperAdministrator: true })
      const { user } = await setupUser()
      const response = await application.fetch(`/api/users/${user.username}/verify`, { method: 'PATCH', headers })
      expect(response).toMatchObject({ status: 204, statusText: 'No Content' })

      // Check database
      const { User } = moduleUser.getRepositories()
      const result = await User.findOneByOrFail({ username: user.username })
      expect(result.verifiedAt).toBeInstanceOf(Date)
    })

    it('should fail with a USER_ALREADY_VERIFIED error if the user is already verified', async({ setupUser, application }) => {
      const { headers } = await setupUser({ isSuperAdministrator: true })
      const { user } = await setupUser({ verifiedAt: new Date() })
      const response = await application.fetch(`/api/users/${user.username}/verify`, { method: 'PATCH', headers })
      const data = await response.json() as Record<string, string>
      expect(response).toMatchObject({ status: 409, statusText: 'Conflict' })
      expect(data).toMatchObject({ data: { name: 'E_USER_ALREADY_VERIFIED' } })
    })
  })

  describe<Context>('with authenticated user', (it) => {
    it('should respond with a USER_FORBIDDEN error', async({ setupUser, moduleUser, application }) => {
      const { headers } = await setupUser()
      const { user } = await setupUser()
      const response = await application.fetch(`/api/users/${user.username}/verify`, { method: 'PATCH', headers })
      const data = await response.json() as Record<string, string>
      expect(response).toMatchObject({ status: 403, statusText: 'Forbidden' })
      expect(data).toMatchObject({ data: { name: 'E_USER_FORBIDDEN' } })

      // Check database
      const { User } = moduleUser.getRepositories()
      const result = await User.findOneByOrFail({ username: user.username })
      expect(result.verifiedAt).toBeUndefined()
    })
  })

  describe<Context>('with unauthenticated user', (it) => {
    it('should not verify the user in the database', async({ setupUser, moduleUser, application }) => {
      const { user } = await setupUser()
      const response = await application.fetch(`/api/users/${user.username}/verify`, { method: 'PATCH' })
      const data = await response.json() as Record<string, string>
      expect(response).toMatchObject({ status: 401, statusText: 'Unauthorized' })
      expect(data).toMatchObject({ data: { name: 'E_USER_UNAUTHORIZED' } })

      // Check database
      const { User } = moduleUser.getRepositories()
      const result = await User.findOneByOrFail({ username: user.username })
      expect(result.verifiedAt).toBeUndefined()
    })
  })
})
