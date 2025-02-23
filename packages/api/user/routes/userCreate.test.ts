/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import { createTestContext, FIXTURE_USER } from '../../__fixtures__'
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
    it('should respond with status 201', async({ setupUser, application }) => {
      const { headers } = await setupUser({ isSuperAdministrator: true })
      const body = JSON.stringify(FIXTURE_USER)
      const response = await application.fetch('/api/users', { method: 'POST', body, headers })
      expect(response).toMatchObject({ status: 201, statusText: 'Created' })
    })

    it('should not respond with a body', async({ setupUser, application }) => {
      const { headers } = await setupUser({ isSuperAdministrator: true })
      const body = JSON.stringify(FIXTURE_USER)
      const response = await application.fetch('/api/users', { method: 'POST', body, headers })
      const data = await response.text()
      expect(data).toBe('')
    })

    it('should create a user in the database', async({ setupUser, moduleUser, application }) => {
      const { headers } = await setupUser({ isSuperAdministrator: true })
      const body = JSON.stringify(FIXTURE_USER)
      await application.fetch('/api/users', { method: 'POST', body, headers })
      const count = await moduleUser.getRepositories().User.countBy(FIXTURE_USER)
      expect(count).toBe(1)
    })

    it('should not create a password for the user', async({ setupUser, moduleUser, application }) => {
      const { headers } = await setupUser({ isSuperAdministrator: true })
      const body = JSON.stringify(FIXTURE_USER)
      await application.fetch('/api/users', { method: 'POST', body, headers })
      const count = await moduleUser.getRepositories().UserPassword.countBy({ user: { username: FIXTURE_USER.username } })
      expect(count).toBe(0)
    })

    it('should create a profile for the user', async({ setupUser, moduleUser, application }) => {
      const { headers } = await setupUser({ isSuperAdministrator: true })
      const body = JSON.stringify(FIXTURE_USER)
      await application.fetch('/api/users', { method: 'POST', body, headers })
      const result = await moduleUser.getRepositories().UserProfile.findOneBy({ displayName: FIXTURE_USER.username })
      expect(result).toMatchObject({
        displayName: FIXTURE_USER.username,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    })

    it('should create a public workspace for the user', async({ setupUser, moduleWorkspace, application }) => {
      const { headers } = await setupUser({ isSuperAdministrator: true })
      const body = JSON.stringify(FIXTURE_USER)
      await application.fetch('/api/users', { method: 'POST', body, headers })
      const [result] = await moduleWorkspace.getRepositories().Workspace.findBy({ name: FIXTURE_USER.username })
      expect(result).toBeInstanceOf(Workspace)
    })

    it('should create a workspace assignment for the user', async({ setupUser, moduleWorkspace, application }) => {
      const { user, headers } = await setupUser({ isSuperAdministrator: true })
      const body = JSON.stringify(FIXTURE_USER)
      await application.fetch('/api/users', { method: 'POST', body, headers })
      const { WorkspaceAssignment } = moduleWorkspace.getRepositories()
      const result = await WorkspaceAssignment.findBy({ user })
      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({ permission: 'Owner' })
    })

    it('should respond with a E_USER_EMAIL_OR_NAME_TAKEN error if the email is already taken', async({ setupUser, application }) => {
      const { headers } = await setupUser({ isSuperAdministrator: true })
      await setupUser(FIXTURE_USER)
      const body = JSON.stringify({ ...FIXTURE_USER, username: 'different-username' })
      const response = await application.fetch('/api/users', { method: 'POST', body, headers })
      const data = await response.json() as Record<string, string>
      expect(response).toMatchObject({ status: 409, statusText: 'Conflict' })
      expect(data).toMatchObject({ data: { name: 'E_USER_EMAIL_OR_NAME_TAKEN' } })
    })

    it('should respond with a E_USER_EMAIL_OR_NAME_TAKEN error if the username is already taken', async({ setupUser, application }) => {
      const { headers } = await setupUser({ isSuperAdministrator: true })
      await setupUser(FIXTURE_USER)
      const body = JSON.stringify({ ...FIXTURE_USER, email: 'different-email@acme.com' })
      const response = await application.fetch('/api/users', { method: 'POST', body, headers })
      const data = await response.json() as Record<string, string>
      expect(response).toMatchObject({ status: 409, statusText: 'Conflict' })
      expect(data).toMatchObject({ data: { name: 'E_USER_EMAIL_OR_NAME_TAKEN' } })
    })
  })

  describe<Context>('with authenticated user', (it) => {
    it('should not create a user in the database', async({ setupUser, moduleUser, application }) => {
      const { headers } = await setupUser()
      const body = JSON.stringify({ email: 'paul@example.com', username: 'paul' })
      await application.fetch('/api/users', { method: 'POST', body, headers })
      const result = await moduleUser.getRepositories().User.findOneBy({ username: 'paul' })
      expect(result).toBeNull()
    })

    it('should respond with a E_USER_FORBIDDEN error', async({ setupUser, application }) => {
      const { headers } = await setupUser()
      const body = JSON.stringify({ email: 'paul@example.com', username: 'paul' })
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
})
