import type { Context } from '../../__fixtures__'
import { ValidationError } from '@unshared/validation'
import { createTestContext, FIXTURE_USER_BASIC } from '../../__fixtures__'
import { createUser } from '../../user/utils'
import { createWorkspace } from './createWorkspace'

describe.concurrent<Context>('createWorkspace', () => {
  beforeEach<Context>(createTestContext)

  describe<Context>('create', (it) => {
    it('should default the name to the user username', async({ moduleWorkspace, moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      const workspace = await createWorkspace.call(moduleWorkspace, { user })
      expect(workspace).toMatchObject({ name: user.username })
    })

    it('should set the name to the provided name', async({ moduleWorkspace, moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      const workspace = await createWorkspace.call(moduleWorkspace, { user, name: 'new-workspace' })
      expect(workspace).toMatchObject({ name: 'new-workspace' })
    })

    it('should create a new private workspace by default', async({ moduleWorkspace, moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      const workspace = await createWorkspace.call(moduleWorkspace, { user })
      expect(workspace).toMatchObject({ isPublic: false })
    })

    it('should create a new public workspace', async({ moduleWorkspace, moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      const workspace = await createWorkspace.call(moduleWorkspace, { user, isPublic: true })
      expect(workspace).toMatchObject({ isPublic: true })
    })

    it('should store the user that created the workspace', async({ moduleWorkspace, moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      const workspace = await createWorkspace.call(moduleWorkspace, { user })
      expect(workspace.createdBy).toMatchObject({ id: user.id })
    })

    it('should assign the workspace to the user with full access', async({ moduleWorkspace, moduleUser }) => {
      const user= await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      const workspace = await createWorkspace.call(moduleWorkspace, { user })
      expect(workspace.assignments).toMatchObject([{ user: { id: user.id }, permission: 'Owner' }])
    })
  })

  describe<Context>('errors', (it) => {
    it('should throw an error if a workspace with the same name already exists', async({ moduleWorkspace, moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      const workspace = await createWorkspace.call(moduleWorkspace, { user })
      await moduleUser.getRepositories().User.save(user)
      await moduleWorkspace.getRepositories().Workspace.save(workspace)
      const shouldReject = createWorkspace.call(moduleWorkspace, { user })
      const error = moduleWorkspace.errors.WORKSPACE_NAME_TAKEN(user.username)
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw an error if the workspace name is empty', async({ moduleWorkspace, moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      const shouldReject = createWorkspace.call(moduleWorkspace, { user, name: '' })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw an error if the workspace user id is not an UUID', async({ moduleWorkspace }) => {
    // @ts-expect-error: testing invalid `user.id`
      const shouldReject = createWorkspace.call(moduleWorkspace, { user: { id: 'not-a-uuid' }, name: 'workspace' })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw an error if the user is not an instance of `User`', async({ moduleWorkspace }) => {
    // @ts-expect-error: testing missing `user.id` property
      const shouldReject = createWorkspace.call(moduleWorkspace, { user: {}, name: 'workspace' })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw an error if the workspace is missing the user', async({ moduleWorkspace }) => {
    // @ts-expect-error: testing missing `user.id` property
      const shouldReject = createWorkspace.call(moduleWorkspace, { name: 'workspace' })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })
  })
})
