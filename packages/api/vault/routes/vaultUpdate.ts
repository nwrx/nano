import type { ModuleVault } from '..'
import type { VaultConfiguration } from '../utils'
import { createHttpRoute } from '@unserved/server'
import { assert, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getVault, updateVault } from '../utils'

export function vaultUpdate(this: ModuleVault) {
  return createHttpRoute(
    {
      name: 'PUT /api/workspaces/:workspace/vaults/:vault',
      parseParameters: createSchema({
        workspace: assert.stringNotEmpty,
        vault: assert.stringNotEmpty,
      }),
      parseBody: assert.objectStrict as unknown as (value: unknown) => VaultConfiguration,
    },
    async({ event, parameters, body }) => this.withTransaction(async() => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { Vault } = this.getRepositories()
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace and check write permission
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const vault = await getVault.call(this, { user, workspace, name: parameters.vault, permission: 'Write' })

      // --- Update the vault configuration and save.
      await updateVault.call(this, { user, vault, configuration: body })
      await Vault.save(vault)
    }),
  )
}
