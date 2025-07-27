import type { ModuleMcpServer } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleMcpPool } from '../../mcpPool'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { applyMcpServer, assertMcpServerTransport, DEFAULT_MCP_SERVER_SPEC, getMcpServer } from '../utils'

export function mcpServerUpdateSpecifications(this: ModuleMcpServer) {
  return createHttpRoute(
    {
      name: 'PUT /api/workspaces/:workspace/pools/:pool/servers/:server/spec',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        pool: assert.stringNotEmpty,
        server: assert.stringNotEmpty,
      }),
      parseBody: createParser({
        image: [[assert.undefined], [assert.string]],
        command: [[assert.undefined], [assert.arrayOf(assert.string)]],
        transport: [[assert.undefined], [assertMcpServerTransport]],
        idleTimeout: [[assert.undefined], [assert.numberInteger, assert.numberGreaterThanOrEqual(0)]],
      }),
    },
    async({ event, parameters, body }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const modulePool = this.getModule(ModuleMcpPool)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace and pool.
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const pool = await modulePool.getPool({ user, workspace, name: parameters.pool, permission: 'Write', withManager: true })
      const server = await getMcpServer.call(this, { workspace, pool, name: parameters.server })

      // --- Update the MCP server spec
      if (body.image !== undefined) server.spec.image = body.image
      if (body.command !== undefined) server.spec.command = body.command
      if (body.transport !== undefined) server.spec.transport = body.transport
      if (body.idleTimeout !== undefined) server.spec.idleTimeout = body.idleTimeout
      server.spec = { ...DEFAULT_MCP_SERVER_SPEC, ...server.spec }

      // --- Save the updated server
      const { McpServer } = this.getRepositories()
      await McpServer.save(server)

      // --- Apply the MCP server changes
      await applyMcpServer.call(this, { workspace, pool, server })
    },
  )
}
