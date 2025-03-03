import type { Context } from '../../__fixtures__'
import { ValidationError } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { getVaultProjectAssignments } from './getVaultProjectAssignments'

describe('getVaultProjectAssignments', () => {
  beforeEach<Context>(createTestContext)

  describe<Context>('success cases', (it) => {
    it('should return project assignments for a vault', async({ setupVault, setupWorkspace, setupProject, moduleVault }) => {
      // Setup vault
      const { workspace } = await setupWorkspace()
      const { project: project1 } = await setupProject({ workspace, name: 'project1' })
      const { project: project2 } = await setupProject({ workspace, name: 'project2' })
      const { vault } = await setupVault({
        workspace,
        projects: [
          [project1, 'Read'],
          [project2, 'Read', 'Write'],
        ],
      })

      // Get and verify project assignments
      const result = await getVaultProjectAssignments.call(moduleVault, { vault })
      expect(result).toHaveLength(2)
      expect(result).toEqual(expect.arrayContaining([
        { project: 'project1', permissions: ['Read'] },
        { project: 'project2', permissions: ['Read', 'Write'] },
      ]))
    })

    it('should return empty array for vault with no project assignments', async({ setupVault, moduleVault }) => {
      const { vault } = await setupVault()
      const result = await getVaultProjectAssignments.call(moduleVault, { vault })
      expect(result).toEqual([])
    })
  })

  describe<Context>('validation', (it) => {
    it('should throw ValidationError if vault is not provided', async(context) => {
      // @ts-expect-error: testing invalid input
      const shouldReject = getVaultProjectAssignments.call(context.moduleVault, {})
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw ValidationError if vault is invalid', async(context) => {
      // @ts-expect-error: testing invalid input
      const shouldReject = getVaultProjectAssignments.call(context.moduleVault, { vault: {} })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })
  })
})
