import type { ModuleMcpPool } from '..'
import type { McpPoolObject } from '../entities'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { searchMcpPools } from '../utils'

export function mcpPoolSearch(this: ModuleMcpPool) {
  return createHttpRoute(
    {
      name: 'GET /workspaces/:workspace/pools',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
      }),
      parseQuery: createParser({
        search: [[assert.undefined], [assert.stringNotEmpty]],
        page: [[assert.undefined], [assert.stringNotEmpty, assert.number]],
        limit: [[assert.undefined], [assert.stringNotEmpty, assert.number]],
        order: [[assert.undefined], [assert.stringNotEmpty, assert.objectStrict]],
        withSpec: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withDeleted: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withServers: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withAssignments: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withProjectAssignments: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
      }),
    },
    async({ event, parameters, query }): Promise<McpPoolObject[]> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)
      const { withSpec, withServers, withAssignments, withProjectAssignments } = query

      // --- Get the workspace and check read permission
      const workspace = await moduleWorkspace.getWorkspace({
        user,
        name: parameters.workspace,
        permission: 'Read',
      })

      // --- Get MCP pools from the workspace with the provided query parameters.
      const pools = await searchMcpPools.call(this, { user, workspace, ...query })
      return pools.map(pool => pool.serialize({
        withSpec,
        withServers,
        withAssignments,
        withProjectAssignments,
      }))
    },
  )
}
