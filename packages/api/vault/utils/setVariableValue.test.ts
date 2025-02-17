import type { Context } from '../../__fixtures__'
import { ValidationError } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { createVariable } from './createVariable'
import { getVariableValue } from './getVariableValue'
import { setVariableValue } from './setVariableValue'

describe.concurrent<Context>('setVariableValue', { timeout: 300 }, () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  describe<Context>('setVariableValue', (it) => {
    it('should update variable value', async({ createUser, createVault, moduleVault }) => {
      const { user, workspace } = await createUser()
      const { vault } = await createVault('vault', user, workspace)
      const variable = await createVariable.call(moduleVault, { user, name: 'variable', value: 'value', vault })
      await setVariableValue.call(moduleVault, { vault, name: variable.name, value: 'new-value' })
      const value = await getVariableValue.call(moduleVault, { vault, name: variable.name })
      expect(value).toBe('new-value')
    })

  })

  describe<Context>('errors', (it) => {
    it('should throw if variable does not exist', async({ createUser, createVault, moduleVault }) => {
      const { user, workspace } = await createUser()
      const { vault } = await createVault('vault', user, workspace)
      const shouldThrow = setVariableValue.call(moduleVault, { vault, name: 'non-existent', value: 'value' })
      await expect(shouldThrow).rejects.toThrow(moduleVault.errors.VAULT_VARIABLE_NOT_FOUND('non-existent', vault.name))
    })
  })

  describe('validation', () => {
    describe<Context>('name', (it) => {
      it('should throw if name is empty', async({ createUser, createVault, moduleVault }) => {
        const { user, workspace } = await createUser()
        const { vault } = await createVault('vault', user, workspace)
        const shouldThrow = setVariableValue.call(moduleVault, { vault, name: '', value: 'value' })
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })
    })

    describe<Context>('value', (it) => {
      it('should throw if value is empty', async({ createUser, createVault, moduleVault }) => {
        const { user, workspace } = await createUser()
        const { vault } = await createVault('vault', user, workspace)
        const shouldThrow = setVariableValue.call(moduleVault, { vault, name: 'variable', value: '' })
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })
    })
  })
})
