import type { Context } from '../../__fixtures__'
import { AssertionError } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { createVariable } from './createVariable'
import { getVariable } from './getVariable'
import { setVariableValue } from './setVariableValue'

describe.concurrent<Context>('setVariableValue', () => {
  beforeEach<Context>(createTestContext)

  describe<Context>('setVariableValue', (it) => {
    it('should update variable value', async({ setupUser, setupVault, moduleVault }) => {
      const { user, workspace } = await setupUser()
      const { vault } = await setupVault({ user, workspace })
      const variable = await createVariable.call(moduleVault, { user, name: 'variable', value: 'value', vault })
      await moduleVault.getRepositories().VaultVariable.save(variable)
      await setVariableValue.call(moduleVault, { workspace, vault, name: variable.name, value: 'new-value' })
      const value = await getVariable.call(moduleVault, { workspace, vault, name: variable.name })
      expect(value).toMatchObject({ id: variable.id, name: variable.name })
    })

  })

  describe<Context>('errors', (it) => {
    it('should throw if variable does not exist', async({ setupUser, setupVault, moduleVault }) => {
      const { user, workspace } = await setupUser()
      const { vault } = await setupVault({ user, workspace })
      const shouldThrow = setVariableValue.call(moduleVault, { workspace, vault, name: 'variable', value: 'value' })
      await expect(shouldThrow).rejects.toThrow(moduleVault.errors.VAULT_VARIABLE_NOT_FOUND(workspace.name, vault.name, 'variable'))
    })
  })

  describe('validation', () => {
    describe<Context>('name', (it) => {
      it('should throw if name is empty', async({ setupUser, setupVault, moduleVault }) => {
        const { user, workspace } = await setupUser()
        const { vault } = await setupVault({ user, workspace })
        const shouldThrow = setVariableValue.call(moduleVault, { workspace, vault, name: '', value: 'value' })
        await expect(shouldThrow).rejects.toThrow(AssertionError)
      })
    })

    describe<Context>('value', (it) => {
      it('should throw if value is empty', async({ setupUser, setupVault, moduleVault }) => {
        const { user, workspace } = await setupUser()
        const { vault } = await setupVault({ user, workspace })
        const shouldThrow = setVariableValue.call(moduleVault, { workspace, vault, name: 'variable', value: '' })
        await expect(shouldThrow).rejects.toThrow(AssertionError)
      })
    })

    describe<Context>('workspace', (it) => {
      it('should throw if workspace is not provided', async({ setupUser, setupVault, moduleVault }) => {
        const { user, workspace } = await setupUser()
        const { vault } = await setupVault({ user, workspace })
        // @ts-expect-error: testing invalid input
        const shouldThrow = setVariableValue.call(moduleVault, { vault, name: 'variable', value: 'value' })
        await expect(shouldThrow).rejects.toThrow(AssertionError)
      })
    })
  })
})
