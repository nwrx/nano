import type { ModuleVault } from '..'
import type { VaultProjectPermissions } from '../utils'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string'
import { assert, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getVault, getVaultProjectAssignments } from '../utils'

export function vaultProjects(this: ModuleVault) {
  return createHttpRoute(
    {
      name: 'GET /api/workspaces/:workspace/vaults/:vault/projects',
      parseParameters: createSchema({
        workspace: assert.stringNotEmpty,
        vault: assert.stringNotEmpty,
      }),
      parseQuery: createSchema({
        withDeleted: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
      }),
    },
    async({ event, parameters, query }): Promise<VaultProjectPermissions[]> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace and check read permission
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const vault = await getVault.call(this, { user, workspace, name: parameters.vault, permission: 'Read', ...query })
      return getVaultProjectAssignments.call(this, { vault })
    },
  )
}
