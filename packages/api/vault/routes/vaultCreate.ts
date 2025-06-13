import type { ModuleVault } from '..'
import type { VaultConfiguration } from '../utils'
import { createHttpRoute } from '@unserved/server'
import { assertObjectStrict, assertStringKebabCase, assertStringNotEmpty, createParser } from '@unshared/validation'
import { setResponseStatus } from 'h3'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { assertVaultType, createVault } from '../utils'

export function vaultCreate(this: ModuleVault) {
  return createHttpRoute(
    {
      name: 'POST /api/workspaces/:workspace/vaults',
      parseParameters: createParser({
        workspace: assertStringNotEmpty,
      }),
      parseBody: createParser({
        name: assertStringKebabCase,
        type: assertVaultType,
        configuration: assertObjectStrict as (value: unknown) => VaultConfiguration,
      }),
    },
    async({ event, body, parameters }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)
      const { name, type, configuration } = body

      // --- Create a new entry in the workspace.
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Owner' })
      const vault = await createVault.call(this, { user, name, type, workspace, configuration })

      // --- Save the vault to the database.
      const { Vault } = this.getRepositories()
      await Vault.save(vault)

      // --- Return the serialized vault.
      setResponseStatus(event, 201)
    },
  )
}
