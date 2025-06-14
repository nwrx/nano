/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { Context } from '../../__fixtures__'
import type { VaultPermission } from './assertVaultPermission'
import { AssertionError, EXP_UUID } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { VAULT_PERMISSIONS } from './assertVaultPermission'
import { ERRORS as E } from './errors'
import { getVault } from './getVault'

interface TestMatrixOptions {
  permission: VaultPermission
  withAccess?: VaultPermission
  withPermission?: VaultPermission
}

async function createResult(context: Context, options: TestMatrixOptions) {
  const { permission, withAccess, withPermission } = options
  const { user } = await context.setupUser()
  const { workspace } = await context.setupWorkspace({ name: 'workspace' })
  const { vault } = await context.setupVault({ name: 'vault', workspace, assignments: [[user, withAccess, withPermission]] })
  return await getVault.call(context.moduleVault, { user, workspace, name: vault.name, permission })
}

describe('getVault', () => {
  beforeEach<Context>(createTestContext)

  const VAULT_READ_PERMISSIONS = ['Read', 'Owner'] as VaultPermission[]
  const VAULT_EXTRA_PERMISSIONS = VAULT_PERMISSIONS.filter(permission => !VAULT_READ_PERMISSIONS.includes(permission))

  // With or without read access
  for (const withAccess of [...VAULT_READ_PERMISSIONS, undefined]) {
    describe<Context>(withAccess ? `with user with ${withAccess} access` : 'with user without read access', () => {

      // With additional permission or not
      for (const withPermission of [...VAULT_EXTRA_PERMISSIONS, undefined]) {
        describe<Context>(withPermission ? `with user with ${withPermission} permission` : 'with user without extra permission', (it) => {

          // Iterate over all possible request permissions
          for (const permission of VAULT_PERMISSIONS) {
            const canRead = withAccess === 'Owner' || withAccess === 'Read'
            const canAccess = (permission === 'Read' && canRead) || permission === withPermission || withAccess === 'Owner'

            if (canRead && canAccess) {
              it(`should return the project when the request permission is "${permission}"`, async(context) => {
                const result = await createResult(context, { permission, withAccess, withPermission })
                expect(result).toMatchObject({ id: expect.stringMatching(EXP_UUID), name: 'vault' })
              })
            }
            else if (canRead) {
              it(`should throw "VAULT_FORBIDDEN" when the request permission is "${permission}"`, async(context) => {
                const shouldReject = createResult(context, { permission, withAccess, withPermission })
                const error = E.VAULT_FORBIDDEN('workspace', 'vault')
                await expect(shouldReject).rejects.toThrow(error)
              })
            }
            else {
              it(`should throw "VAULT_NOT_FOUND" when the request permission is "${permission}"`, async(context) => {
                const shouldReject = createResult(context, { permission, withAccess, withPermission })
                const error = E.VAULT_NOT_FOUND('workspace', 'vault')
                await expect(shouldReject).rejects.toThrow(error)
              })
            }
          }
        })
      }
    })
  }

  describe<Context>('withDeleted', (it) => {
    it('should return the vault when withDeleted is true', async(context) => {
      const { user } = await context.setupUser()
      const { workspace } = await context.setupWorkspace({ name: 'workspace' })
      const { vault } = await context.setupVault({ name: 'vault', workspace, assignments: [[user, 'Read']] })
      await context.moduleVault.getRepositories().Vault.softRemove(vault)
      const result = await getVault.call(context.moduleVault, { user, workspace, name: vault.name, permission: 'Read', withDeleted: true })
      expect(result).toMatchObject({ id: expect.stringMatching(EXP_UUID), name: 'vault' })
    })

    it('should not return the vault when withDeleted is false', async(context) => {
      const { user } = await context.setupUser()
      const { workspace } = await context.setupWorkspace({ name: 'workspace' })
      const { vault } = await context.setupVault({ name: 'vault', workspace, assignments: [[user, 'Read']] })
      await context.moduleVault.getRepositories().Vault.softRemove(vault)
      const shouldReject = getVault.call(context.moduleVault, { user, workspace, name: vault.name, permission: 'Read', withDeleted: false })
      const error = E.VAULT_NOT_FOUND('workspace', 'vault')
      await expect(shouldReject).rejects.toThrow(error)
    })
  })

  describe<Context>('edge cases', (it) => {
    it('should throw "VAULT_NOT_FOUND" if the vault is not found', async({ moduleVault, setupWorkspace, setupUser }) => {
      const { user } = await setupUser()
      const { workspace } = await setupWorkspace()
      const shouldReject = getVault.call(moduleVault, { user, workspace, name: 'not-found', permission: 'Read' })
      const error = moduleVault.errors.VAULT_NOT_FOUND(workspace.name, 'not-found')
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw "VAULT_NOT_FOUND" for multiple users with different access levels', async(context) => {
      const { user: user1 } = await context.setupUser()
      const { user: user2 } = await context.setupUser()
      const { workspace } = await context.setupWorkspace()
      const { vault } = await context.setupVault({ name: 'shared-vault', workspace, assignments: [[user1, 'Read'], [user2, 'Write']] })

      // User 1 with Read access requesting Write permission
      const shouldRejectUser1 = getVault.call(context.moduleVault, { user: user1, workspace, name: vault.name, permission: 'Write' })
      const error1 = E.VAULT_FORBIDDEN(workspace.name, vault.name)
      await expect(shouldRejectUser1).rejects.toThrow(error1)

      // User 2 with Write access requesting Read permission
      const shouldRejectUser2 = getVault.call(context.moduleVault, { user: user2, workspace, name: vault.name, permission: 'Read' })
      const error2 = E.VAULT_NOT_FOUND(workspace.name, vault.name)
      await expect(shouldRejectUser2).rejects.toThrow(error2)
    })
  })

  describe<Context>('assertion errors', (it) => {
    it('should throw a "AssertionError" if the request permission is not provided', async({ moduleVault, setupWorkspace, setupUser }) => {
      const { user } = await setupUser()
      const { workspace } = await setupWorkspace()
      // @ts-expect-error: testing invalid input
      const shouldReject = getVault.call(moduleVault, { user, workspace, name: 'vault', permission: undefined })
      await expect(shouldReject).rejects.toThrow(AssertionError)
    })

    it('should throw a "AssertionError" if the request permission is invalid', async({ moduleVault, setupWorkspace, setupUser }) => {
      const { user } = await setupUser()
      const { workspace } = await setupWorkspace()
      // @ts-expect-error: testing invalid input
      const shouldReject = getVault.call(moduleVault, { user, workspace, name: 'vault', permission: 'Invalid' })
      await expect(shouldReject).rejects.toThrow(AssertionError)
    })

    it('should throw a "AssertionError" if vault name is empty', async({ moduleVault, setupWorkspace, setupUser }) => {
      const { user } = await setupUser()
      const { workspace } = await setupWorkspace()
      const shouldReject = getVault.call(moduleVault, { user, workspace, name: '', permission: 'Read' })
      await expect(shouldReject).rejects.toThrow(AssertionError)
    })

    it('should throw a "AssertionError" if the user is not provided', async({ moduleVault, setupWorkspace }) => {
      const { workspace } = await setupWorkspace()
      // @ts-expect-error: testing invalid input
      const shouldReject = getVault.call(moduleVault, { workspace, name: 'vault', permission: 'Read' })
      await expect(shouldReject).rejects.toThrow(AssertionError)
    })

    it('should throw a "AssertionError" if the user does not have an "id" property', async({ moduleVault, setupWorkspace }) => {
      const { workspace } = await setupWorkspace()
      // @ts-expect-error: testing invalid input
      const shouldReject = getVault.call(moduleVault, { user: {}, workspace, name: 'vault', permission: 'Read' })
      await expect(shouldReject).rejects.toThrowError(AssertionError)
    })

    it('should throw a "AssertionError" if workspace is not provided', async({ moduleVault, setupUser }) => {
      const { user } = await setupUser()
      // @ts-expect-error: testing invalid input
      const shouldReject = getVault.call(moduleVault, { user, name: 'vault', permission: 'Read' })
      await expect(shouldReject).rejects.toThrow(AssertionError)
    })

    it('should throw a "AssertionError" if withDeleted is not a boolean', async({ moduleVault, setupWorkspace, setupUser }) => {
      const { user } = await setupUser()
      const { workspace } = await setupWorkspace()
      // @ts-expect-error: testing invalid input
      const shouldReject = getVault.call(moduleVault, { user, workspace, name: 'vault', permission: 'Read', withDeleted: 'yes' })
      await expect(shouldReject).rejects.toThrow(AssertionError)
    })
  })
})
