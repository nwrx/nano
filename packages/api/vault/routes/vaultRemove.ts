import type { ModuleVault } from '..'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getVault } from '../utils'

export function vaultRemove(this: ModuleVault) {
  return createHttpRoute(
    {
      name: 'DELETE /api/workspaces/:workspace/vaults/:vault',
      parseParameters: createSchema({
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
      await Vault.softRemove(vault)
    },
  )
}
