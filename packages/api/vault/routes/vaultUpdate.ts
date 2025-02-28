import type { ModuleVault } from '..'
import type { VaultConfiguration } from '../utils'
import { createHttpRoute } from '@unserved/server'
import { assertObjectStrict, assertStringKebabCase, assertStringNotEmpty, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getVault } from '../utils'

export function vaultUpdate(this: ModuleVault) {
  return createHttpRoute(
    {
      name: 'PATCH /api/workspaces/:workspace/vaults/:vault',
      parseParameters: createSchema({
        workspace: assertStringNotEmpty,
        vault: assertStringNotEmpty,
      }),
      parseBody: createSchema({
        name: assertStringKebabCase,
        configuration: assertObjectStrict as (value: unknown) => VaultConfiguration,
      }),
    },
    async({ event, parameters, body }) => this.withTransaction(async() => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { Vault } = this.getRepositories()
      const { user } = await moduleUser.authenticate(event)
      const { name /* , configuration */ } = body

      // --- Get the workspace and check write permission
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Write' })
      const vault = await getVault.call(this, { user, name: parameters.vault, workspace, permission: 'Write' })

      // --- Update the vault properties and save.
      if (name) vault.name = name
      await Vault.save(vault)
    }),
  )
}
