import type { McpServerObject } from '../entities'
import type { ModuleMcpServer } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleMcpPool } from '../../mcpPool'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { createMcpServer } from '../utils'

export function mcpServerCreate(this: ModuleMcpServer) {
  return createHttpRoute(
    {
      name: 'POST /workspaces/:workspace/pools/:pool/servers',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        pool: assert.stringNotEmpty,
      }),
      parseBody: createParser({
        name: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters, body }): Promise<McpServerObject> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const modulePool = this.getModule(ModuleMcpPool)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace and pool.
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const pool = await modulePool.getPool({ user, workspace, name: parameters.pool, permission: 'Write' })

      // --- Create the MCP server
      const { name } = body
      const server = await createMcpServer.call(this, { user, pool, name })
      return server.serialize()
    },
  )
}
