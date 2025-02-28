import type { Context } from '../../__fixtures__'
import { ValidationError } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { createVariable } from './createVariable'
import { getVariableValue } from './getVariableValue'

describe.concurrent<Context>('getVariableValue', () => {
  beforeEach<Context>(createTestContext)

  describe<Context>('getVariableValue', (it) => {
    it('should get variable value', async({ setupUser, setupVault, moduleVault }) => {
      const { workspace, user } = await setupUser()
      const { vault } = await setupVault({ workspace, name: 'vault' })
      const variable = await createVariable.call(moduleVault, { user, name: 'variable', value: 'secret-value', vault })
      await moduleVault.getRepositories().VaultVariable.save(variable)
      const value = await getVariableValue.call(moduleVault, { workspace, vault, name: 'variable' })
      expect(value).toBe('secret-value')
    })
  })

  describe<Context>('errors', (it) => {
    it('should throw if variable does not exist', async({ setupUser, setupVault, moduleVault }) => {
      const { workspace } = await setupUser()
      const { vault } = await setupVault({ workspace, name: 'vault' })
      const shouldThrow = getVariableValue.call(moduleVault, { workspace, vault, name: 'non-existent' })
      await expect(shouldThrow).rejects.toThrow(moduleVault.errors.VAULT_VARIABLE_NOT_FOUND(workspace.name, vault.name, 'non-existent'))
    })
  })

  describe('validation', () => {
    describe<Context>('workspace', (it) => {
      it('should throw if workspace is missing', async({ setupVault, moduleVault }) => {
        const { vault } = await setupVault()
        // @ts-expect-error: testing invalid options
        const shouldThrow = getVariableValue.call(moduleVault, { vault, name: 'variable' })
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })
    })

    describe<Context>('vault', (it) => {
      it('should throw if vault is missing', async({ setupWorkspace, moduleVault }) => {
        const { workspace } = await setupWorkspace()
        // @ts-expect-error: testing invalid options
        const shouldThrow = getVariableValue.call(moduleVault, { workspace, name: 'variable' })
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })
    })

    describe<Context>('name', (it) => {
      it('should throw if name is missing', async({ setupVault, setupWorkspace, moduleVault }) => {
        const { vault } = await setupVault()
        const { workspace } = await setupWorkspace()
        // @ts-expect-error: testing invalid options
        const shouldThrow = getVariableValue.call(moduleVault, { workspace, vault })
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })

      it('should throw if name is empty', async({ setupVault, setupWorkspace, moduleVault }) => {
        const { vault } = await setupVault()
        const { workspace } = await setupWorkspace()
        const shouldThrow = getVariableValue.call(moduleVault, { workspace, vault, name: '' })
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })
    })
  })
})
