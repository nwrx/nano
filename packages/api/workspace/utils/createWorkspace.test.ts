import type { Context } from '../../__fixtures__'
import { AssertionError } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { createWorkspace } from './createWorkspace'

describe.concurrent<Context>('createWorkspace', () => {
  beforeEach<Context>(createTestContext)

  describe<Context>('result', (it) => {
    it('should set the name to the provided name', async({ moduleWorkspace, setupUser }) => {
      const { user } = await setupUser()
      const workspace = await createWorkspace.call(moduleWorkspace, { user, name: 'workspace' })
      expect(workspace).toMatchObject({ name: 'workspace' })
    })

    it('should create a new private workspace by default', async({ moduleWorkspace, setupUser }) => {
      const { user } = await setupUser()
      const workspace = await createWorkspace.call(moduleWorkspace, { user, name: 'workspace' })
      expect(workspace).toMatchObject({ isPublic: false })
    })

    it('should create a new public workspace', async({ moduleWorkspace, setupUser }) => {
      const { user } = await setupUser()
      const workspace = await createWorkspace.call(moduleWorkspace, { user, name: 'workspace', isPublic: true })
      expect(workspace).toMatchObject({ isPublic: true })
    })

    it('should store the user that created the workspace', async({ moduleWorkspace, setupUser }) => {
      const { user } = await setupUser()
      const workspace = await createWorkspace.call(moduleWorkspace, { user, name: 'workspace' })
      expect(workspace.createdBy).toMatchObject({ id: user.id })
    })

    it('should assign the workspace to the user with full access', async({ moduleWorkspace, setupUser }) => {
      const { user } = await setupUser()
      const workspace = await createWorkspace.call(moduleWorkspace, { user, name: 'workspace' })
      expect(workspace.assignments).toMatchObject([{ user: { id: user.id }, permission: 'Owner' }])
    })
  })

  describe<Context>('database', (it) => {
    it('should persist the workspace in the database', async({ moduleWorkspace, setupUser }) => {
      const { user } = await setupUser()
      const workspace = await createWorkspace.call(moduleWorkspace, { user, name: 'workspace' })
      await moduleWorkspace.getRepositories().Workspace.save(workspace)
      const { Workspace } = moduleWorkspace.getRepositories()
      const result = await Workspace.countBy({ name: workspace.name })
      expect(result).toBe(1)
    })
  })

  describe<Context>('errors', (it) => {
    it('should throw an error if a workspace with the same name already exists', async({ moduleWorkspace, setupUser }) => {
      const { user } = await setupUser()
      const workspace = await createWorkspace.call(moduleWorkspace, { user, name: 'workspace' })
      await moduleWorkspace.getRepositories().Workspace.save(workspace)
      const shouldReject = createWorkspace.call(moduleWorkspace, { user, name: 'workspace' })
      const error = moduleWorkspace.errors.WORKSPACE_NAME_TAKEN('workspace')
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw an error if the workspace name is empty', async({ moduleWorkspace, setupUser }) => {
      const { user } = await setupUser()
      const shouldReject = createWorkspace.call(moduleWorkspace, { user, name: '' })
      await expect(shouldReject).rejects.toThrow(AssertionError)
    })

    it('should throw an error if the workspace user id is not an UUID', async({ moduleWorkspace }) => {
    // @ts-expect-error: testing invalid `user.id`
      const shouldReject = createWorkspace.call(moduleWorkspace, { user: { id: 'not-a-uuid' }, name: 'workspace' })
      await expect(shouldReject).rejects.toThrow(AssertionError)
    })

    it('should throw an error if the user is not an instance of `User`', async({ moduleWorkspace }) => {
    // @ts-expect-error: testing missing `user.id` property
      const shouldReject = createWorkspace.call(moduleWorkspace, { user: {}, name: 'workspace' })
      await expect(shouldReject).rejects.toThrow(AssertionError)
    })

    it('should throw an error if the workspace is missing the user', async({ moduleWorkspace }) => {
    // @ts-expect-error: testing missing `user.id` property
      const shouldReject = createWorkspace.call(moduleWorkspace, { name: 'workspace' })
      await expect(shouldReject).rejects.toThrow(AssertionError)
    })
  })
})
