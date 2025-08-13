import type { McpServerVariableObject } from '../entities'
import type { ModuleMcpServerVariable } from '../index'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string'
import { assert, createParser } from '@unshared/validation'
import { ModuleMcpPool } from '../../mcpPool'
import { ModuleMcpServer } from '../../mcpServer'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { searchServerVariables } from '../utils/searchServerVariables'

export function mcpServerVariableSearch(this: ModuleMcpServerVariable) {
  return createHttpRoute(
    {
      name: 'GET /workspaces/:workspace/pools/:pool/servers/:server/variables',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        pool: assert.stringNotEmpty,
        server: assert.stringNotEmpty,
      }),
      parseQuery: createParser({
        search: [[assert.undefined], [assert.stringNotEmpty]],
        page: [[assert.undefined], [assert.stringNotEmpty, assert.number]],
        limit: [[assert.undefined], [assert.stringNotEmpty, assert.number]],
        order: [[assert.undefined], [assert.stringNotEmpty, assert.objectStrict]],
        withValue: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withVault: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withVariable: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withCreatedBy: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withUpdatedBy: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withDeleted: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
      }),
    },
    async({ event, parameters, query }): Promise<McpServerVariableObject[]> => {
      const moduleUser = this.getModule(ModuleUser)
      const modulePool = this.getModule(ModuleMcpPool)
      const moduleServer = this.getModule(ModuleMcpServer)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace and check read permission
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const pool = await modulePool.getPool({ user, workspace, name: parameters.pool, permission: 'Read' })
      const server = await moduleServer.getServer({ workspace, pool, name: parameters.server })

      // --- Get MCP server variables from the workspace with the provided query parameters.
      const variables = await searchServerVariables.call(this, { server, ...query })
      return variables.map(variable => variable.serialize(query))
    },
  )
}
