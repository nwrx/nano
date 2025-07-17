import type { McpServerArgumentObject } from '../entities'
import type { ModuleMcpServerArgument } from '../index'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string'
import { assert, createParser } from '@unshared/validation'
import { ModuleMcpPool } from '../../mcpPool'
import { ModuleMcpServer } from '../../mcpServer'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { searchArguments } from '../utils'

export function mcpServerArgumentSearch(this: ModuleMcpServerArgument) {
  return createHttpRoute(
    {
      name: 'GET /api/workspaces/:workspace/pools/:pool/servers/:server/arguments',
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
        withPool: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withServer: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withValue: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withVault: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withVariable: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withCreatedBy: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withUpdatedBy: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withDeleted: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
      }),
    },
    async({ event, parameters, query }): Promise<McpServerArgumentObject[]> => {
      const moduleUser = this.getModule(ModuleUser)
      const modulePool = this.getModule(ModuleMcpPool)
      const moduleServer = this.getModule(ModuleMcpServer)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace and check read permission
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const pool = await modulePool.getPool({ user, workspace, name: parameters.pool, permission: 'Read' })
      const server = await moduleServer.getServer({ workspace, pool, name: parameters.server })

      // --- Get MCP server arguments from the workspace with the provided query parameters.
      const arguments_ = await searchArguments.call(this, { server, ...query })
      return arguments_.map(argument => argument.serialize(query))
    },
  )
}
