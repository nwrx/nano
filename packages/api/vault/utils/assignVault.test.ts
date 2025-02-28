import type { Context } from '../../__fixtures__'
import type { AssignVaultOptions } from './assignVault'
import { ValidationError } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { VaultAssignment } from '../entities'
import { assignVault } from './assignVault'
import { ERRORS } from './errors'

describe.concurrent<Context>('assignVault', () => {
  beforeEach<Context>(createTestContext)

  describe<Context>('result', (it) => {
    it('should assign a vault to a user', async({ setupUser, setupVault, moduleVault }) => {
      const { user: owner, workspace } = await setupUser()
      const { user: assignee } = await setupUser()
      const { vault } = await setupVault({ user: owner, workspace })
      const options = { user: owner, assignee, vault, permission: 'Read' }
      const assignment = await assignVault.call(moduleVault, options as AssignVaultOptions)
      expect(assignment).toBeInstanceOf(VaultAssignment)
      expect(assignment).toMatchObject({
        id: assignment.id,
        user: { id: assignee.id },
        vault: { id: vault.id },
        permission: 'Read',
        createdBy: { id: owner.id },
      })
    })

    it('should not save the assignment to the database', async({ setupUser, setupVault, moduleVault }) => {
      const { user: owner, workspace } = await setupUser()
      const { user: assignee } = await setupUser()
      const { vault } = await setupVault({ user: owner, workspace })
      const options = { user: owner, assignee, vault, permission: 'Read' }
      await assignVault.call(moduleVault, options as AssignVaultOptions)
      const count = await moduleVault.getRepositories().VaultAssignment.countBy({ vault })
      expect(count).toBe(0)
    })
  })

  describe<Context>('database', (it) => {
    it('should save the assignment to the database', async({ setupUser, setupVault, moduleVault }) => {
      const { user: owner, workspace } = await setupUser()
      const { user: assignee } = await setupUser()
      const { vault } = await setupVault({ user: owner, workspace })
      const options = { user: owner, assignee, vault, permission: 'Read' }
      const assignment = await assignVault.call(moduleVault, options as AssignVaultOptions)
      await moduleVault.getRepositories().VaultAssignment.save(assignment)
      const { VaultAssignment } = moduleVault.getRepositories()
      const found = await VaultAssignment.findOneBy({ id: assignment.id })
      expect(found).toMatchObject({ id: assignment.id })
    })
  })

  describe<Context>('errors', (it) => {
    it('should throw if the vault is already assigned to the user', async({ setupUser, setupVault, moduleVault }) => {
      const { user: owner, workspace } = await setupUser()
      const { user: assignee } = await setupUser()
      const { vault } = await setupVault({ user: owner, workspace })
      const options = { user: owner, assignee, vault, permission: 'Read' }
      const assigment = await assignVault.call(moduleVault, options as AssignVaultOptions)
      await moduleVault.getRepositories().VaultAssignment.save(assigment)
      const shouldThrow = assignVault.call(moduleVault, options as AssignVaultOptions)
      const error = ERRORS.VAULT_ALREADY_ASSIGNED(vault.name, assignee.username)
      await expect(shouldThrow).rejects.toThrowError(error)
    })
  })

  describe<Context>('validation', (it) => {
    it('should throw if user is missing', async({ setupUser, setupVault, moduleVault }) => {
      const { user: owner, workspace } = await setupUser()
      const { user: assignee } = await setupUser()
      const { vault } = await setupVault({ user: owner, workspace })
      const options = { assignee, vault, permission: 'Read' }
      // @ts-expect-error: testing invalid options
      const shouldThrow = assignVault.call(moduleVault, options)
      await expect(shouldThrow).rejects.toThrow(ValidationError)
    })

    it('should throw if assignee is missing', async({ setupUser, setupVault, moduleVault }) => {
      const { user: owner, workspace } = await setupUser()
      const { vault } = await setupVault({ user: owner, workspace })
      const options = { user: owner, vault, permission: 'Read' }
      // @ts-expect-error: testing invalid options
      const shouldThrow = assignVault.call(moduleVault, options)
      await expect(shouldThrow).rejects.toThrow(ValidationError)
    })

    it('should throw if vault is missing', async({ setupUser, moduleVault }) => {
      const { user: owner } = await setupUser()
      const { user: assignee } = await setupUser()
      const options = { user: owner, assignee, permission: 'Read' }
      // @ts-expect-error: testing invalid options
      const shouldThrow = assignVault.call(moduleVault, options)
      await expect(shouldThrow).rejects.toThrow(ValidationError)
    })

    it('should throw if permission is missing', async({ setupUser, setupVault, moduleVault }) => {
      const { user: owner, workspace } = await setupUser()
      const { user: assignee } = await setupUser()
      const { vault } = await setupVault({ user: owner, workspace })
      const options = { user: owner, assignee, vault }
      // @ts-expect-error: testing invalid options
      const shouldThrow = assignVault.call(moduleVault, options)
      await expect(shouldThrow).rejects.toThrow(ValidationError)
    })

    it('should throw if permission is invalid', async({ setupUser, setupVault, moduleVault }) => {
      const { user: owner, workspace } = await setupUser()
      const { user: assignee } = await setupUser()
      const { vault } = await setupVault({ user: owner, workspace })
      const options = { user: owner, assignee, vault, permission: 'Invalid' }
      // @ts-expect-error: testing invalid options
      const shouldThrow = assignVault.call(moduleVault, options)
      await expect(shouldThrow).rejects.toThrow(ValidationError)
    })
  })
})
