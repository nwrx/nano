/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import { ValidationError } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { updateVaultUserPermissions } from './updateVaultUserPermissions'

describe.concurrent<Context>('assignVaultUser', () => {
  beforeEach<Context>(createTestContext)

  describe<Context>('result', (it) => {
    it('should assign a vault to a user', async({ setupUser, setupVault, moduleVault }) => {
      const { user: owner } = await setupUser()
      const { user: assignee } = await setupUser()
      const { vault } = await setupVault({ user: owner })
      const assignments = await updateVaultUserPermissions.call(moduleVault, { user: owner, assignee, vault, permissions: ['Read'] })
      expect(assignments).toBeInstanceOf(Array)
      expect(assignments).toHaveLength(1)
      expect(assignments).toMatchObject([{
        user: { id: assignee.id },
        vault: { id: vault.id },
        permission: 'Read',
        createdBy: { id: owner.id },
      }])
    })

    it('should add additional permissions to the user', async({ setupUser, setupVault, moduleVault }) => {
      const { user: owner } = await setupUser()
      const { vault } = await setupVault({ user: owner })
      const updated = await updateVaultUserPermissions.call(moduleVault, { user: owner, assignee: owner, vault, permissions: ['Read', 'Write', 'Owner'] })
      expect(updated).toBeInstanceOf(Array)
      expect(updated).toHaveLength(3)
      expect(updated).toMatchObject([
        { deletedAt: undefined, permission: 'Owner' },
        { deletedAt: undefined, permission: 'Read' },
        { deletedAt: undefined, permission: 'Write' },
      ])
    })

    it('should remove permissions from the user', async({ setupUser, setupVault, moduleVault }) => {
      const { user: owner } = await setupUser()
      const { vault } = await setupVault({ user: owner })
      const updated = await updateVaultUserPermissions.call(moduleVault, { user: owner, assignee: owner, vault, permissions: ['Read'] })
      expect(updated).toBeInstanceOf(Array)
      expect(updated).toHaveLength(2)
      expect(updated).toMatchObject([
        { deletedAt: expect.any(Date), permission: 'Owner' },
        { deletedAt: undefined, permission: 'Read' },
      ])
    })
  })

  describe<Context>('database', (it) => {
    it('should save the assignment to the database', async({ setupUser, setupVault, moduleVault }) => {
      const { user: owner } = await setupUser()
      const { user: assignee } = await setupUser()
      const { vault } = await setupVault({ user: owner })
      const assignments = await updateVaultUserPermissions.call(moduleVault, { user: owner, assignee, vault, permissions: ['Read'] })
      const { VaultAssignment } = moduleVault.getRepositories()
      await VaultAssignment.save(assignments)
      const count = await VaultAssignment.countBy({ vault: { id: vault.id } })
      expect(count).toBe(2)
    })

    it('should not save the assignment to the database', async({ setupUser, setupVault, moduleVault }) => {
      const { user: owner } = await setupUser()
      const { user: assignee } = await setupUser()
      const { vault } = await setupVault({ user: owner })
      await updateVaultUserPermissions.call(moduleVault, { user: owner, assignee, vault, permissions: ['Read'] })
      const count = await moduleVault.getRepositories().VaultAssignment.countBy({ vault })
      expect(count).toBe(0)
    })
  })

  describe<Context>('validation', (it) => {
    it('should throw on missing options', async({ moduleVault }) => {
      // @ts-expect-error: testing invalid options
      const shouldThrow = updateVaultUserPermissions.call(moduleVault, {})
      await expect(shouldThrow).rejects.toThrow(ValidationError)
    })
  })
})
