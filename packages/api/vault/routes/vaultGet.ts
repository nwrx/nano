import type { ModuleVault } from '..'
import type { VaultObject } from '../entities'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getVault } from '../utils'

export function vaultGet(this: ModuleVault) {
  return createHttpRoute(
    {
      name: 'GET /api/workspaces/:workspace/vaults/:vault',
      parseParameters: createSchema({
        workspace: assertStringNotEmpty,
        vault: assertStringNotEmpty,
      }),
    },
    async({ event, parameters }): Promise<VaultObject> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace and check read permission
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const vault = await getVault.call(this, { user, name: parameters.vault, workspace, permission: 'Read' })

      // --- Return the serialized vault.
      return vault.serialize()
    },
  )
}
