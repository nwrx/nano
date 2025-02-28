/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import type { VaultPermission } from './assertVaultPermission'
import { EXP_UUID, ValidationError } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { VAULT_PERMISSIONS } from './assertVaultPermission'
import { searchVaults } from './searchVaults'

interface TestMatrixOptions {
  withPermission?: VaultPermission
}

async function createResult(context: Context, options: TestMatrixOptions) {
  const { withPermission } = options
  const { user } = await context.setupUser()
  const { workspace } = await context.setupWorkspace({ name: 'workspace' })
  await context.setupVault({ name: 'vault', workspace, assignments: [[user, withPermission]] })
  return await searchVaults.call(context.moduleVault, { user, workspace })
}

describe('searchVaults', () => {
  beforeEach<Context>(createTestContext)

  // Iterate over all possible permissions
  for (const withPermission of [...VAULT_PERMISSIONS, undefined]) {
    describe<Context>(withPermission ? `with user with ${withPermission} permission` : 'with user without any permission', (it) => {

      if (withPermission === 'Read' || withPermission === 'Owner') {
        it('should return the vaults', async(context) => {
          const result = await createResult(context, { withPermission })
          expect(result).toMatchObject([{ id: expect.stringMatching(EXP_UUID), name: 'vault' }])
        })
      }
      else {
        it('should return an empty array', async(context) => {
          const result = await createResult(context, { withPermission })
          expect(result).toEqual([])
        })
      }
    })
  }

  describe<Context>('filtering', (it) => {
    it('should return empty array when no matches found', async({ setupUser, setupWorkspace, moduleVault }) => {
      const { user } = await setupUser()
      const { workspace } = await setupWorkspace()
      const results = await searchVaults.call(moduleVault, { user, workspace, search: 'vault' })
      expect(results).toEqual([])
    })

    it('should find using case-insensitive search', async({ setupUser, setupWorkspace, setupVault, moduleVault }) => {
      const { user } = await setupUser()
      const { workspace } = await setupWorkspace()
      await setupVault({ user, workspace, name: 'vault' })
      const results = await searchVaults.call(moduleVault, { user, workspace, search: 'VAULT' })
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('vault')
    })

    it('should return all vaults when search is not provided', async({ setupUser, setupWorkspace, setupVault, moduleVault }) => {
      const { user } = await setupUser()
      const { workspace } = await setupWorkspace()
      await setupVault({ user, workspace, name: 'vault1' })
      await setupVault({ user, workspace, name: 'vault2' })
      const results = await searchVaults.call(moduleVault, { user, workspace })
      expect(results).toHaveLength(2)
    })

    it('should respect pagination and ordering options', async({ setupUser, setupWorkspace, setupVault, moduleVault }) => {
      const { user } = await setupUser()
      const { workspace } = await setupWorkspace()
      await setupVault({ user, workspace, name: 'vault1' })
      await setupVault({ user, workspace, name: 'vault2' })
      await setupVault({ user, workspace, name: 'vault3' })
      const results = await searchVaults.call(moduleVault, { user, workspace, page: 3, limit: 1, order: { name: 'DESC' } })
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('vault1')
    })

    it('should sanitize special characters from search string', async({ setupUser, setupWorkspace, setupVault, moduleVault }) => {
      const { user } = await setupUser()
      const { workspace } = await setupWorkspace()
      await setupVault({ user, workspace, name: 'vault' })
      const results = await searchVaults.call(moduleVault, { user, workspace, search: 'va!ult' })
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('vault')
    })

    it('should preserve spaces and alphanumeric characters', async({ setupUser, setupWorkspace, setupVault, moduleVault }) => {
      const { user } = await setupUser()
      const { workspace } = await setupWorkspace()
      await setupVault({ user, workspace, name: 'vault 123' })
      const results = await searchVaults.call(moduleVault, { user, workspace, search: 'vault 123' })
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('vault 123')
    })

    it('should ignore search when length is less than 3', async({ setupUser, setupWorkspace, setupVault, moduleVault }) => {
      const { user } = await setupUser()
      const { workspace } = await setupWorkspace()
      await setupVault({ user, workspace, name: 'vault' })
      const results = await searchVaults.call(moduleVault, { user, workspace, search: 'xx' })
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('vault')
    })
  })

  describe<Context>('validation', (it) => {
    it('should throw a "ValidationError" if workspace is not provided', async({ moduleVault }) => {
      // @ts-expect-error: testing invalid input
      const shouldReject = () => searchVaults.call(moduleVault, { search: 'vault' })
      await expect(shouldReject).rejects.toThrowError(ValidationError)
    })

    it('should throw a "ValidationError" if search is invalid', async({ setupUser, setupWorkspace, moduleVault }) => {
      const { user } = await setupUser()
      const { workspace } = await setupWorkspace()
      // @ts-expect-error: testing invalid input
      const shouldReject = () => searchVaults.call(moduleVault, { user, workspace, search: 123 })
      await expect(shouldReject).rejects.toThrowError(ValidationError)
    })

    it('should throw a "ValidationError" if search is not a string', async({ setupUser, setupWorkspace, moduleVault }) => {
      const { user } = await setupUser()
      const { workspace } = await setupWorkspace()
      // @ts-expect-error: testing invalid input
      const shouldReject = () => searchVaults.call(moduleVault, { user, workspace, search: ['vault'] })
      await expect(shouldReject).rejects.toThrowError(ValidationError)
    })

    it('should throw a "ValidationError" if page is invalid', async({ setupUser, setupWorkspace, moduleVault }) => {
      const { user } = await setupUser()
      const { workspace } = await setupWorkspace()
      // @ts-expect-error: testing invalid input
      const shouldReject = () => searchVaults.call(moduleVault, { user, workspace, page: '1' })
      await expect(shouldReject).rejects.toThrowError(ValidationError)
    })

    it('should throw a "ValidationError" if limit is invalid', async({ setupUser, setupWorkspace, moduleVault }) => {
      const { user } = await setupUser()
      const { workspace } = await setupWorkspace()
      // @ts-expect-error: testing invalid input
      const shouldReject = () => searchVaults.call(moduleVault, { user, workspace, limit: '10' })
      await expect(shouldReject).rejects.toThrowError(ValidationError)
    })

    it('should throw a "ValidationError" if user is invalid', async({ setupWorkspace, moduleVault }) => {
      const { workspace } = await setupWorkspace()
      // @ts-expect-error: testing invalid input
      const shouldReject = () => searchVaults.call(moduleVault, { workspace, user: 'user' })
      await expect(shouldReject).rejects.toThrowError(ValidationError)
    })

    it('should throw a "ValidationError" if user is not provided', async({ setupWorkspace, moduleVault }) => {
      const { workspace } = await setupWorkspace()
      // @ts-expect-error: testing invalid input
      const shouldReject = () => searchVaults.call(moduleVault, { workspace })
      await expect(shouldReject).rejects.toThrowError(ValidationError)
    })

    it('should throw a "ValidationError" if order is invalid', async({ setupUser, setupWorkspace, moduleVault }) => {
      const { user } = await setupUser()
      const { workspace } = await setupWorkspace()
      // @ts-expect-error: testing invalid input
      const shouldReject = () => searchVaults.call(moduleVault, { user, workspace, order: 'order' })
      await expect(shouldReject).rejects.toThrowError(ValidationError)
    })
  })
})
