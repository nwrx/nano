/* eslint-disable unicorn/no-null */
import type { ModuleVault } from '..'
import { createHttpRoute } from '@unserved/server'
import { assert, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getVault } from '../utils'

export function vaultEnable(this: ModuleVault) {
  return createHttpRoute(
    {
      name: 'PUT /api/workspaces/:workspace/vaults/:name/enabled',
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

      // --- Throw an error if the vault is already enabled.
      if (!vault.disabledAt) throw this.errors.VAULT_ALREADY_ENABLED(workspace.name, vault.name)

      // --- Unset the vault as the default.
      vault.disabledAt = null
      await Vault.save(vault)
    }),
  )
}
