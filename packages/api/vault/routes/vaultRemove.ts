import type { ModuleVault } from '..'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getVault } from '../utils'

export function vaultRemove(this: ModuleVault) {
  return createHttpRoute(
    {
      name: 'DELETE /workspaces/:workspace/vaults/:vault',
      parseParameters: createParser({
        workspace: assertStringNotEmpty,
        vault: assertStringNotEmpty,
      }),
    },
    async({ event, parameters }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace/vault and check read permission.
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const vault = await getVault.call(this, { user, workspace, name: parameters.vault, permission: 'Owner' })

      // --- Soft remove the vault.
      const { Vault } = this.getRepositories()
      vault.deletedBy = user
      vault.deletedAt = new Date()
      await Vault.save(vault)
    },
  )
}
