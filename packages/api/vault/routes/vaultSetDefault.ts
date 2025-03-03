import type { ModuleVault } from '..'
import { createHttpRoute } from '@unserved/server'
import { assert, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getVault } from '../utils'

export function vaultSetDefault(this: ModuleVault) {
  return createHttpRoute(
    {
      name: 'PUT /api/workspaces/:workspace/vaults/:name/default',
      parseParameters: createSchema({
        workspace: assert.stringNotEmpty,
        name: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters }) => this.withTransaction(async() => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)
      const { Vault } = this.getRepositories()

      // --- Get the workspace and check write permission
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Owner' })
      const vault = await getVault.call(this, { user, workspace, name: parameters.name, permission: 'Write' })

      // --- Throw an error if the vault is already the default.
      if (vault.isDefault) throw this.errors.VAULT_ALREADY_DEFAULT(workspace.name, vault.name)

      // --- Find the current default vault and unset it.
      const defaultVault = await Vault.findOne({ where: { workspace, isDefault: true } })
      if (defaultVault) {
        defaultVault.isDefault = false
        await Vault.save(defaultVault)
      }

      // --- Set the vault as the default.
      vault.isDefault = true
      vault.updatedAt = new Date()
      vault.updatedBy = user
      await Vault.save(vault)
    }),
  )
}
