/* eslint-disable unicorn/no-null */
import type { ModuleVault } from '..'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getVault } from '../utils'

export function vaultDisable(this: ModuleVault) {
  return createHttpRoute(
    {
      name: 'PUT /api/workspaces/:workspace/vaults/:vault/disable',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        vault: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters }) => this.withTransaction(async() => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)
      const { Vault } = this.getRepositories()

      // --- Get the workspace and check write permission
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Owner' })
      const vault = await getVault.call(this, { user, workspace, name: parameters.vault, permission: 'Write' })
      if (vault.disabledAt) throw this.errors.VAULT_ALREADY_DISABLED(workspace.name, vault.name)

      // --- Unset the vault as the default.
      vault.isDefault = null
      vault.disabledAt = new Date()
      vault.disabledBy = user
      await Vault.save(vault)
    }),
  )
}
