import type { EventStream } from '@unserved/server'
import type { McpServerLog, ModuleMcpServer } from '..'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleMcpPool } from '../../mcpPool'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getMcpServer, getMcpServerClient } from '../utils'

export function mcpServerGetLogs(this: ModuleMcpServer) {
  return createHttpRoute(
    {
      name: 'GET /api/workspaces/:workspace/pools/:pool/servers/:server/logs',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        pool: assert.stringNotEmpty,
        server: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters }): Promise<EventStream<McpServerLog>> => {
      const moduleUser = this.getModule(ModuleUser)
      const modulePool = this.getModule(ModuleMcpPool)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace and check read permission
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const pool = await modulePool.getPool({ user, workspace, name: parameters.pool, permission: 'Read', withManager: true })
      const server = await getMcpServer.call(this, { workspace, pool, name: parameters.server })

      // --- Get the events stream from the MCP server client
      const client = await getMcpServerClient.call(this, { workspace, pool, server })
      return client.logs.subscribe(event)
    },
  )
}
