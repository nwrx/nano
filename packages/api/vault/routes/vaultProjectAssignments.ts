import type { ModuleVault } from '..'
import type { VaultPermission } from '../utils'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string'
import { assert, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getVault, getVaultProjectPermissions } from '../utils'

export function vaultProjects(this: ModuleVault) {
  return createHttpRoute(
    {
      name: 'GET /api/workspaces/:workspace/vaults/:name/projects',
      parseParameters: createSchema({
        workspace: assert.stringNotEmpty,
        name: assert.stringNotEmpty,
      }),
      parseQuery: createSchema({
        withDeleted: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
      }),
    },
    async({ event, parameters, query }): Promise<Record<string, VaultPermission[]>> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace and check read permission
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const vault = await getVault.call(this, { user, workspace, name: parameters.name, permission: 'Owner', ...query })
      return getVaultProjectPermissions.call(this, { vault })
    },
  )
}
