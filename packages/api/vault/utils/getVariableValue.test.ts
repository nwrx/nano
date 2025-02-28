import type { Context } from '../../__fixtures__'
import { ValidationError } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { createVariable } from './createVariable'
import { getVariableValue } from './getVariableValue'

describe.concurrent<Context>('getVariableValue', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  describe<Context>('getVariableValue', (it) => {
    it('should get variable value', async({ setupUser, setupVault, moduleVault }) => {
      const { user } = await setupUser()
      const { vault } = await setupVault()
      const variable = await createVariable.call(moduleVault, { user, name: 'variable', value: 'secret-value', vault })
      await moduleVault.getRepositories().VaultVariable.save(variable)
      const value = await getVariableValue.call(moduleVault, { vault, name: 'variable' })
      expect(value).toBe('secret-value')
    })
  })

  describe<Context>('errors', (it) => {
    it('should throw if variable does not exist', async({ setupVault, moduleVault }) => {
      const { vault } = await setupVault()
      const shouldThrow = getVariableValue.call(moduleVault, { vault, name: 'non-existent' })
      await expect(shouldThrow).rejects.toThrow(moduleVault.errors.VAULT_VARIABLE_NOT_FOUND('non-existent', vault.name))
    })
  })

  describe('validation', () => {
    describe<Context>('vault', (it) => {
      it('should throw if vault is missing', async({ moduleVault }) => {
        // @ts-expect-error: testing invalid options
        const shouldThrow = getVariableValue.call(moduleVault, { name: 'variable' })
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })
    })

    describe<Context>('name', (it) => {
      it('should throw if name is missing', async({ setupVault, moduleVault }) => {
        const { vault } = await setupVault()
        // @ts-expect-error: testing invalid options
        const shouldThrow = getVariableValue.call(moduleVault, { vault })
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })

      it('should throw if name is empty', async({ setupVault, moduleVault }) => {
        const { vault } = await setupVault()
        const shouldThrow = getVariableValue.call(moduleVault, { vault, name: '' })
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })
    })
  })
})
