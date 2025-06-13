import type { Context } from '../../__fixtures__'
import type { VaultPermission } from './assertVaultPermission'
import { ValidationError } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { createVariable } from './createVariable'
import { getVariableValue } from './getVariableValue'

describe.concurrent<Context>('getVariableValue', () => {
  beforeEach<Context>(createTestContext)

  describe<Context>('getVariableValue', (it) => {
    it('should get variable value', async({ setupUser, setupVault, setupProject, moduleVault }) => {
      const { workspace, user } = await setupUser()
      const { project } = await setupProject({ workspace, user })
      const { vault } = await setupVault({ workspace, projects: [[project, 'Use']], name: 'vault' })
      const variable = await createVariable.call(moduleVault, { user, name: 'variable', value: 'secret-value', vault })
      await moduleVault.getRepositories().VaultVariable.save(variable)
      const value = await getVariableValue.call(moduleVault, { workspace, project, vault: vault.name, name: 'variable' })
      expect(value).toBe('secret-value')
    })
  })

  describe<Context>('errors', (it) => {
    it('should throw if variable does not exist', async({ setupUser, setupProject, setupVault, moduleVault }) => {
      const { user, workspace } = await setupUser()
      const { project } = await setupProject({ workspace, user })
      const { vault } = await setupVault({ workspace, name: 'vault' })
      const shouldThrow = getVariableValue.call(moduleVault, { workspace, project, vault: vault.name, name: 'non-existent' })
      await expect(shouldThrow).rejects.toThrow(moduleVault.errors.VAULT_VARIABLE_NOT_FOUND(workspace.name, vault.name, 'non-existent'))
    })

    it('should throw if vault is not assigned to the project', async({ setupUser, setupVault, setupProject, moduleVault }) => {
      const { workspace, user } = await setupUser()
      const { project } = await setupProject({ workspace, user })
      const { vault } = await setupVault({ workspace, name: 'vault' })
      const shouldThrow = getVariableValue.call(moduleVault, { workspace, project, vault: vault.name, name: 'variable' })
      await expect(shouldThrow).rejects.toThrow(moduleVault.errors.VAULT_VARIABLE_NOT_FOUND(workspace.name, vault.name, 'variable'))
    })

    const permissions = ['Read', 'Write', 'Owner'] as VaultPermission[]
    for (const permisison of permissions) {
      it(`should throw if project only has ${permisison} permission`, async({ setupUser, setupVault, setupProject, moduleVault }) => {
        const { workspace, user } = await setupUser()
        const { project } = await setupProject({ workspace, user })
        const { vault } = await setupVault({ workspace, projects: [[project, permisison]], name: 'vault' })
        const shouldThrow = getVariableValue.call(moduleVault, { workspace, project, vault: vault.name, name: 'variable' })
        await expect(shouldThrow).rejects.toThrow(moduleVault.errors.VAULT_VARIABLE_NOT_FOUND(workspace.name, vault.name, 'variable'))
      })
    }
  })

  describe('validation', () => {
    describe<Context>('workspace', (it) => {
      it('should throw if workspace is missing', async({ setupProject, setupVault, moduleVault }) => {
        const { project } = await setupProject()
        const { vault } = await setupVault()
        // @ts-expect-error: testing invalid options
        const shouldThrow = getVariableValue.call(moduleVault, { project, vault: vault.name, name: 'variable' })
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })

      it('should throw if workspace is invalid', async({ setupUser, setupProject, setupVault, moduleVault }) => {
        const { user, workspace } = await setupUser()
        const { project } = await setupProject({ user })
        const { vault } = await setupVault({ workspace })
        // @ts-expect-error: testing invalid options
        const shouldThrow = getVariableValue.call(moduleVault, { project, vault: vault.name, name: 'variable', workspace: 'invalid-workspace' })
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })
    })

    describe<Context>('project', (it) => {
      it('should throw if project is missing', async({ setupUser, setupVault, moduleVault }) => {
        const { workspace } = await setupUser()
        const { vault } = await setupVault({ workspace })
        // @ts-expect-error: testing invalid options
        const shouldThrow = getVariableValue.call(moduleVault, { workspace, vault: vault.name, name: 'variable' })
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })

      it('should throw if project is invalid', async({ setupUser, setupVault, moduleVault }) => {
        const { workspace } = await setupUser()
        const { vault } = await setupVault({ workspace })
        // @ts-expect-error: testing invalid options
        const shouldThrow = getVariableValue.call(moduleVault, { workspace, project: 'invalid-project', vault: vault.name, name: 'variable' })
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })
    })

    describe<Context>('vault', (it) => {
      it('should throw if vault is missing', async({ setupUser, setupProject, moduleVault }) => {
        const { workspace, user } = await setupUser()
        const { project } = await setupProject({ workspace, user })
        // @ts-expect-error: testing invalid options
        const shouldThrow = getVariableValue.call(moduleVault, { workspace, project, name: 'variable' })
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })

      it('should throw if vault is empty', async({ setupUser, setupProject, moduleVault }) => {
        const { workspace, user } = await setupUser()
        const { project } = await setupProject({ workspace, user })
        const shouldThrow = getVariableValue.call(moduleVault, { workspace, project, vault: '', name: 'variable' })
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })
    })

    describe<Context>('name', (it) => {
      it('should throw if name is missing', async({ setupUser, setupProject, setupVault, moduleVault }) => {
        const { workspace, user } = await setupUser()
        const { project } = await setupProject({ workspace, user })
        const { vault } = await setupVault({ workspace })
        // @ts-expect-error: testing invalid options
        const shouldThrow = getVariableValue.call(moduleVault, { workspace, project, vault: vault.name })
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })

      it('should throw if name is empty', async({ setupUser, setupProject, setupVault, moduleVault }) => {
        const { workspace, user } = await setupUser()
        const { project } = await setupProject({ workspace, user })
        const { vault } = await setupVault({ workspace })
        const shouldThrow = getVariableValue.call(moduleVault, { workspace, project, vault: vault.name, name: '' })
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })
    })
  })
})
