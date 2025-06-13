import type { Context } from '../../__fixtures__'
import { AssertionError } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { VaultVariable } from '../entities'
import { createVariable } from './createVariable'
import { getVariable } from './getVariable'

describe.concurrent<Context>('getVariable', () => {
  beforeEach<Context>(createTestContext)

  describe<Context>('getVariable', (it) => {
    it('should get variable', async({ setupUser, setupVault, moduleVault }) => {
      const { workspace, user } = await setupUser()
      const { vault } = await setupVault({ workspace })
      const variable = await createVariable.call(moduleVault, { user, name: 'variable', value: 'secret-value', vault })
      await moduleVault.getRepositories().VaultVariable.save(variable)
      const value = await getVariable.call(moduleVault, { workspace, vault, name: 'variable' })
      expect(value).toBeInstanceOf(VaultVariable)
    })
  })

  describe<Context>('errors', (it) => {
    it('should throw if variable does not exist', async({ setupUser, setupVault, moduleVault }) => {
      const { workspace } = await setupUser()
      const { vault } = await setupVault({ workspace })
      const shouldThrow = getVariable.call(moduleVault, { workspace, vault, name: 'non-existent' })
      const error = moduleVault.errors.VAULT_VARIABLE_NOT_FOUND(workspace.name, vault.name, 'non-existent')
      await expect(shouldThrow).rejects.toThrow(error)
    })
  })

  describe('validation', () => {
    describe<Context>('workspace', (it) => {
      it('should throw if workspace is missing', async({ setupVault, moduleVault }) => {
        const { vault } = await setupVault()
        // @ts-expect-error: testing invalid options
        const shouldThrow = getVariable.call(moduleVault, { vault, name: 'variable' })
        await expect(shouldThrow).rejects.toThrow(AssertionError)
      })
    })

    describe<Context>('vault', (it) => {
      it('should throw if vault is missing', async({ setupUser, moduleVault }) => {
        const { workspace } = await setupUser()
        // @ts-expect-error: testing invalid options
        const shouldThrow = getVariable.call(moduleVault, { workspace, name: 'variable' })
        await expect(shouldThrow).rejects.toThrow(AssertionError)
      })
    })

    describe<Context>('name', (it) => {
      it('should throw if name is missing', async({ setupVault, setupUser, moduleVault }) => {
        const { workspace } = await setupUser()
        const { vault } = await setupVault()
        // @ts-expect-error: testing invalid options
        const shouldThrow = getVariable.call(moduleVault, { workspace, vault })
        await expect(shouldThrow).rejects.toThrow(AssertionError)
      })

      it('should throw if name is empty', async({ setupVault, setupWorkspace, moduleVault }) => {
        const { workspace } = await setupWorkspace()
        const { vault } = await setupVault({ workspace })
        const shouldThrow = getVariable.call(moduleVault, { workspace, vault, name: '' })
        await expect(shouldThrow).rejects.toThrow(AssertionError)
      })
    })
  })
})
