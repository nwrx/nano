import type { Tool } from '@modelcontextprotocol/sdk/types.js'
import type { ModuleMcpServer } from '..'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string'
import { assert, createParser } from '@unshared/validation'
import { ModuleMcpPool } from '../../mcpPool'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getMcpServer, getMcpServerClient } from '../utils'

export function mcpServerRefreshTools(this: ModuleMcpServer) {
  return createHttpRoute(
    {
      name: 'GET /workspaces/:workspace/pools/:pool/servers/:server/tools',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        pool: assert.stringNotEmpty,
        server: assert.stringNotEmpty,
      }),
      parseQuery: createParser({
        refresh: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
      }),
    },
    async({ event, query, parameters }): Promise<{ tools: Tool[] }> => {
      const moduleUser = this.getModule(ModuleUser)
      const modulePool = this.getModule(ModuleMcpPool)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace, pool and server.
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const pool = await modulePool.getPool({ user, workspace, name: parameters.pool, permission: 'Read', withManager: true })
      const server = await getMcpServer.call(this, { workspace, pool, name: parameters.server })

      // --- If the refresh query parameter is not true, return the cached tools.
      if (!query.refresh) return { tools: server.tools ?? [] }

      // --- List the tools from the MCP server client.
      const { McpServer } = this.getRepositories()
      const client = await getMcpServerClient.call(this, { workspace, pool, server })
      const tools = await client.listTools()

      // --- Save the tools to the MCP server entity.
      server.tools = tools
      await McpServer.save(server)
      return { tools }
    },
  )
}
