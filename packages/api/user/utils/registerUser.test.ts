/* eslint-disable sonarjs/no-hardcoded-passwords */
import type { Context } from '../../__fixtures__'
import { createTestContext, FIXTURE_USER_BASIC } from '../../__fixtures__'
import { ModuleWorkspace } from '../../workspace'
import { User } from '../entities'
import { registerUser } from './registerUser'

describe.concurrent('registerUser', () => {
  beforeEach<Context>(createTestContext)

  describe<Context>('user', (it) => {
    it('should create a new user', async({ moduleUser }) => {
      const result = await registerUser.call(moduleUser, FIXTURE_USER_BASIC)
      expect(result.user).toBeInstanceOf(User)
      expect(result.user.username).toBe(FIXTURE_USER_BASIC.username)
      expect(result.user.email).toBe(FIXTURE_USER_BASIC.email)
    })

    it('should persist the user in the database', async({ moduleUser }) => {
      const { user } = await registerUser.call(moduleUser, FIXTURE_USER_BASIC)
      const { User } = moduleUser.getRepositories()
      const count = await User.count({ where: { id: user.id } })
      expect(count).toBe(1)
    })
  })

  describe<Context>('password', (it) => {
    it('should create a password if provided', async({ moduleUser }) => {
      const options = { ...FIXTURE_USER_BASIC, password: 'password123' }
      await registerUser.call(moduleUser, options)
      const { UserPassword } = moduleUser.getRepositories()
      const count = await UserPassword.count()
      expect(count).toBe(1)
    })

    it('should not create a password if not provided', async({ moduleUser }) => {
      await registerUser.call(moduleUser, FIXTURE_USER_BASIC)
      const { UserPassword } = moduleUser.getRepositories()
      const count = await UserPassword.count()
      expect(count).toBe(0)
    })
  })

  describe<Context>('workspace', (it) => {
    it('should create a workspace for the user', async({ moduleUser }) => {
      const { workspace, user } = await registerUser.call(moduleUser, FIXTURE_USER_BASIC)
      expect(workspace).toBeDefined()
      expect(workspace.name).toBe(FIXTURE_USER_BASIC.username)
      expect(workspace.isPublic).toBe(true)
      expect(workspace.createdBy).toMatchObject({ id: user.id })
    })

    it('should assign the workspace to the user with full access', async({ moduleUser }) => {
      const { workspace, user } = await registerUser.call(moduleUser, FIXTURE_USER_BASIC)
      expect(workspace.assignments).toMatchObject([{ user: { id: user.id }, permission: 'Owner' }])
    })

    it('should persist the workspace in the database', async({ moduleUser }) => {
      const { workspace } = await registerUser.call(moduleUser, FIXTURE_USER_BASIC)
      const { Workspace } = moduleUser.getModule(ModuleWorkspace).getRepositories()
      const count = await Workspace.count({ where: { id: workspace.id } })
      expect(count).toBe(1)
    })
  })

  describe.todo<Context>('vault', (it) => {
    it('should create a vault for the user')
    it('should associate the vault with the user')
    it('should associate the vault with the workspace')
    it('should persist the vault in the database')
  })
})
