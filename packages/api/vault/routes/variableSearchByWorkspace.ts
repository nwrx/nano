import type { VaultVariableObject } from '../entities'
import type { ModuleVault } from '../index'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string/parseBoolean'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { searchVariableByWorkspace } from '../utils'

export function variableSearchByWorkspace(this: ModuleVault) {
  return createHttpRoute(
    {
      name: 'GET /workspaces/:workspace/variables',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
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

      // --- Get the workspace with read permission and search the variables.
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Owner' })
      const variables = await searchVariableByWorkspace.call(this, { workspace, ...query })
      return variables.map(variable => variable.serialize({ withVault: query.withVault }))
    },
  )
}
