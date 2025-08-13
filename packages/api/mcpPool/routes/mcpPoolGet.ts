import type { ModuleMcpPool } from '..'
import type { McpPoolObject } from '../entities'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getMcpPool } from '../utils'

export function mcpPoolGet(this: ModuleMcpPool) {
  return createHttpRoute(
    {
      name: 'GET /workspaces/:workspace/pools/:pool',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        pool: assert.stringNotEmpty,
      }),
      parseQuery: createParser({
        withSpec: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withDeleted: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withManager: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withServers: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withAssignments: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withProjectAssignments: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
      }),
    },
    async({ event, parameters, query }): Promise<McpPoolObject> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)
      const {
        withSpec = false,
        withDeleted = false,
        withManager = false,
        withServers = false,
        withAssignments = false,
        withProjectAssignments = false,
      } = query

      // --- Get the workspace and check read permission
      const workspace = await moduleWorkspace.getWorkspace({
        user,
        name: parameters.workspace,
        permission: 'Read',
      })

      // --- Get the MCP pool
      const pool = await getMcpPool.call(this, {
        user,
        workspace,
        name: parameters.pool,
        permission: 'Read',
        withDeleted,
        withServers,
        withManager,
        withAssignments,
        withProjectAssignments,
      })

      return pool.serialize({
        withSpec,
        withServers,
        withManager,
      })
    },
  )
}
