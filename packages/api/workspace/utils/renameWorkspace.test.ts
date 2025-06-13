import type { Context } from '../../__fixtures__'
import { AssertionError } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { ERRORS } from './errors'
import { renameWorkspace } from './renameWorkspace'

describe.concurrent<Context>('renameWorkspace', () => {
  beforeEach<Context>(createTestContext)

  describe<Context>('result', (it) => {
    it('should rename a workspace', async({ setupWorkspace, moduleWorkspace }) => {
      const { workspace } = await setupWorkspace()
      const updatedWorkspace = await renameWorkspace.call(moduleWorkspace, { workspace, name: 'new-name' })
      expect(updatedWorkspace).toMatchObject({ id: workspace.id, name: 'new-name' })
    })

    it('should slugify the workspace name', async({ setupWorkspace, moduleWorkspace }) => {
      const { workspace } = await setupWorkspace()
      const updatedWorkspace = await renameWorkspace.call(moduleWorkspace, { workspace, name: 'New Name' })
      expect(updatedWorkspace.name).toBe('new-name')
    })

    it('should not save the workspace to the database yet', async({ setupWorkspace, moduleWorkspace }) => {
      const { workspace } = await setupWorkspace()
      await renameWorkspace.call(moduleWorkspace, { workspace, name: 'new-name' })
      const count = await moduleWorkspace.getRepositories().Workspace.countBy({ name: 'new-name' })
      expect(count).toBe(0)
    })
  })

  describe<Context>('database', (it) => {
    it('should save the workspace to the database', async({ setupWorkspace, moduleWorkspace }) => {
      const { workspace } = await setupWorkspace()
      const updatedWorkspace = await renameWorkspace.call(moduleWorkspace, { workspace, name: 'new-name' })
      await moduleWorkspace.getRepositories().Workspace.save(updatedWorkspace)
      const count = await moduleWorkspace.getRepositories().Workspace.countBy({ name: 'new-name' })
      expect(count).toBe(1)
    })
  })

  describe<Context>('validations', (it) => {
    it('should throw an error if the new name is already taken', async({ setupWorkspace, moduleWorkspace }) => {
      const { workspace } = await setupWorkspace()
      await setupWorkspace({ name: 'new-name' })
      const shouldReject = renameWorkspace.call(moduleWorkspace, { workspace, name: 'new-name' })
      const error = ERRORS.WORKSPACE_NAME_TAKEN('new-name')
      await expect(shouldReject).rejects.toThrowError(error)
    })
  })

  describe<Context>('errors', (it) => {
    it('should throw an error if the new name is missing', async({ setupWorkspace, moduleWorkspace }) => {
      const { workspace } = await setupWorkspace()
      const shouldReject = renameWorkspace.call(moduleWorkspace, { workspace })
      await expect(shouldReject).rejects.toThrow(AssertionError)
    })

    it('should throw an error if the workspace is missing', async({ moduleWorkspace }) => {
      const shouldReject = renameWorkspace.call(moduleWorkspace, { name: 'new-name' })
      await expect(shouldReject).rejects.toThrow(AssertionError)
    })
  })
})
