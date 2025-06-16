import type { VaultVariableObject } from '../entities'
import type { ModuleVault } from '../index'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string/parseBoolean'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getVault, searchVariableByVault } from '../utils'

export function variableSearchByVault(this: ModuleVault) {
  return createHttpRoute(
    {
      name: 'GET /api/workspaces/:workspace/vaults/:vault/variables',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        vault: assert.stringNotEmpty,
      }),
      parseQuery: createParser({
        search: [[assert.undefined], [assert.stringNotEmpty]],
        page: [[assert.undefined], [assert.stringNotEmpty, assert.number]],
        limit: [[assert.undefined], [assert.stringNotEmpty, assert.number]],
        order: [[assert.undefined], [assert.stringNotEmpty, assert.objectStrict]],
        withVault: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
      }),
    },
    async({ event, query, parameters }): Promise<VaultVariableObject[]> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace and vault with read permission and search the variables.
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const vault = await getVault.call(this, { user, workspace, name: parameters.vault, permission: 'Read' })
      const variables = await searchVariableByVault.call(this, { vault, ...query })
      return variables.map(variable => variable.serialize({ withVault: query.withVault }))
    },
  )
}
