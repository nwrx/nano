import type { ModuleVault } from '..'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { searchVaults } from '../utils'

export function vaultSearch(this: ModuleVault) {
  return createHttpRoute(
    {
      name: 'GET /api/workspaces/:workspace/vaults',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
      }),
      parseQuery: createParser({
        search: [[assert.undefined], [assert.stringNotEmpty]],
        page: [[assert.undefined], [assert.stringNotEmpty, assert.number]],
        limit: [[assert.undefined], [assert.stringNotEmpty, assert.number]],
        order: [[assert.undefined], [assert.stringNotEmpty, assert.objectStrict]],
      }),
    },
    async({ event, parameters, query }) => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace and check read permission
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const vaults = await searchVaults.call(this, { user, workspace, ...query })

      // --- Return the serialized vaults.
      return vaults.map(vault => vault.serialize())
    },
  )
}
