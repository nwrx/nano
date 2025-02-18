import type { ModuleVault } from '..'
import type { VaultConfiguration } from '../utils'
import { createHttpRoute } from '@unserved/server'
import { assertObjectStrict, assertStringKebabCase, assertStringNotEmpty, createSchema } from '@unshared/validation'
import { setResponseStatus } from 'h3'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { assertVaultType, createVault } from '../utils'

export function vaultCreate(this: ModuleVault) {
  return createHttpRoute(
    {
      name: 'POST /api/workspaces/:workspace/vaults',
      parseParameters: createSchema({
        workspace: assertStringNotEmpty,
      }),
      parseBody: createSchema({
        name: assertStringKebabCase,
        type: assertVaultType,
        configuration: assertObjectStrict as (value: unknown) => VaultConfiguration,
      }),
    },
    async({ event, body, parameters }) => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)
      const { name, type, configuration } = body

      // --- Get the workspace with write permission.
      const workspace = await moduleWorkspace.getWorkspace({
        user,
        name: parameters.workspace,
        permission: 'Write',
      })

      // --- Create the vault entity.
      const vault = await createVault.call(this, {
        user,
        name,
        type,
        workspace,
        configuration,
      })

      // --- Return the serialized vault.
      setResponseStatus(event, 201)
      return vault.serialize()
    },
  )
}
