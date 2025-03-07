/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import { ValidationError } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { updateVaultProjectPermissions } from './updateVaultProjectPermissions'

describe.concurrent<Context>('updateVaultProjectPermissions', () => {
  beforeEach<Context>(createTestContext)

  describe<Context>('result', (it) => {
    it('should assign a vault to a project', async({ setupUser, setupProject, setupVault, moduleVault }) => {
      const { user: owner } = await setupUser()
      const { project } = await setupProject({ user: owner })
      const { vault } = await setupVault({ user: owner })
      const assignments = await updateVaultProjectPermissions.call(moduleVault, { user: owner, project, vault, permissions: ['Read'] })
      expect(assignments).toBeInstanceOf(Array)
      expect(assignments).toHaveLength(1)
      expect(assignments).toMatchObject([{
        project: { id: project.id },
        vault: { id: vault.id },
        permission: 'Read',
        createdBy: { id: owner.id },
      }])
    })

    it('should add additional permissions to the project', async({ setupUser, setupProject, setupVault, moduleVault }) => {
      const { user: owner } = await setupUser()
      const { project } = await setupProject({ user: owner })
      const { vault } = await setupVault({ user: owner, projects: [[project, 'Read']] })
      const updated = await updateVaultProjectPermissions.call(moduleVault, { user: owner, project, vault, permissions: ['Read', 'Write'] })
      expect(updated).toBeInstanceOf(Array)
      expect(updated).toHaveLength(2)
      expect(updated).toMatchObject([
        { deletedAt: undefined, permission: 'Read' },
        { deletedAt: undefined, permission: 'Write' },
      ])
    })

    it('should remove permissions from the project', async({ setupUser, setupProject, setupVault, moduleVault }) => {
      const { user: owner } = await setupUser()
      const { project } = await setupProject({ user: owner })
      const { vault } = await setupVault({ user: owner, projects: [[project, 'Read', 'Write']] })
      const updated = await updateVaultProjectPermissions.call(moduleVault, { user: owner, project, vault, permissions: ['Read'] })
      expect(updated).toBeInstanceOf(Array)
      expect(updated).toHaveLength(2)
      expect(updated).toMatchObject([
        { deletedAt: undefined, permission: 'Read' },
        { deletedAt: expect.any(Date), permission: 'Write' },
      ])
    })
  })

  describe<Context>('database', (it) => {
    it('should save the assignment to the database', async({ setupUser, setupProject, setupVault, moduleVault }) => {
      const { user: owner } = await setupUser()
      const { project } = await setupProject({ user: owner })
      const { vault } = await setupVault({ user: owner })
      const assignments = await updateVaultProjectPermissions.call(moduleVault, { user: owner, project, vault, permissions: ['Read'] })
      const { VaultProjectAssignment } = moduleVault.getRepositories()
      await VaultProjectAssignment.save(assignments)
      const count = await VaultProjectAssignment.countBy({ vault: { id: vault.id } })
      expect(count).toBe(1)
    })

    it('should not save the assignment to the database automatically', async({ setupUser, setupProject, setupVault, moduleVault }) => {
      const { user: owner } = await setupUser()
      const { project } = await setupProject({ user: owner })
      const { vault } = await setupVault({ user: owner })
      await updateVaultProjectPermissions.call(moduleVault, { user: owner, project, vault, permissions: ['Read'] })
      const count = await moduleVault.getRepositories().VaultProjectAssignment.countBy({ vault })
      expect(count).toBe(0)
    })
  })

  describe<Context>('validation', (it) => {
    it('should throw on missing options', async({ moduleVault }) => {
      // @ts-expect-error: testing invalid options
      const shouldThrow = updateVaultProjectPermissions.call(moduleVault, {})
      await expect(shouldThrow).rejects.toThrow(ValidationError)
    })
  })
})
