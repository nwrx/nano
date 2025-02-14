import type { Context } from '../../__fixtures__'
import { ValidationError } from '@unshared/validation'
import { randomUUID } from 'node:crypto'
import { createTestContext } from '../../__fixtures__'
import { renameWorkspace } from './renameWorkspace'

describe.concurrent('renameWorkspace', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  describe<Context>('rename', (it) => {
    it('should rename the workspace', async({ createWorkspace, moduleWorkspace }) => {
      const { workspace } = await createWorkspace('old-name')
      const result = await renameWorkspace.call(moduleWorkspace, { id: workspace.id, name: 'new-name' })
      expect(result).toMatchObject({
        id: workspace.id,
        name: 'new-name',
      })
    })

    it('should persist the new name in the database', async({ createWorkspace, moduleWorkspace }) => {
      const { workspace } = await createWorkspace('old-name')
      await renameWorkspace.call(moduleWorkspace, { id: workspace.id, name: 'new-name' })
      const { Workspace } = moduleWorkspace.getRepositories()
      const result = await Workspace.findOneBy({ id: workspace.id })
      expect(result).toMatchObject({
        id: workspace.id,
        name: 'new-name',
      })
    })
  })

  describe<Context>('errors', (it) => {
    it('should throw if the workspace does not exist', async({ moduleWorkspace }) => {
      const id = randomUUID()
      const shouldReject = renameWorkspace.call(moduleWorkspace, { id, name: 'new-name' })
      const error = moduleWorkspace.errors.WORKSPACE_NOT_FOUND('new-name')
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw if the new name is already taken', async({ createWorkspace, moduleWorkspace }) => {
      const { workspace: workspace1 } = await createWorkspace('workspace-1')
      await createWorkspace('workspace-2')
      const shouldReject = renameWorkspace.call(moduleWorkspace, { id: workspace1.id, name: 'workspace-2' })
      const error = moduleWorkspace.errors.WORKSPACE_NAME_TAKEN('workspace-2')
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw if the workspace id is not a UUID', async({ moduleWorkspace }) => {
      // @ts-expect-error: testing invalid input
      const shouldReject = renameWorkspace.call(moduleWorkspace, { id: 'not-a-uuid', name: 'new-name' })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw if the new name is empty', async({ moduleWorkspace }) => {
      const id = randomUUID()
      const shouldReject = renameWorkspace.call(moduleWorkspace, { id, name: '' })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw if the workspace id is missing', async({ moduleWorkspace }) => {
      // @ts-expect-error: testing missing required property
      const shouldReject = renameWorkspace.call(moduleWorkspace, { name: 'new-name' })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw if the new name is missing', async({ moduleWorkspace }) => {
      // @ts-expect-error: testing missing required property
      const shouldReject = renameWorkspace.call(moduleWorkspace, { id: randomUUID() })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })
  })
})
