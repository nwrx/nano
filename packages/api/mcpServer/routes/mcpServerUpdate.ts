import type { ModuleMcpServer } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleMcpPool } from '../../mcpPool'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getMcpServer } from '../utils'

export function mcpServerUpdate(this: ModuleMcpServer) {
  return createHttpRoute(
    {
      name: 'PUT /workspaces/:workspace/pools/:pool/servers/:server',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        pool: assert.stringNotEmpty,
        server: assert.stringNotEmpty,
      }),
      parseBody: createParser({
        title: [[assert.undefined], [assert.string]],
        description: [[assert.undefined], [assert.string]],
      }),
    },
    async({ event, parameters, body }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const modulePool = this.getModule(ModuleMcpPool)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace and pool.
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const pool = await modulePool.getPool({ user, workspace, name: parameters.pool, permission: 'Write' })
      const server = await getMcpServer.call(this, { workspace, pool, name: parameters.server })

      // --- Update the MCP server
      const { McpServer } = this.getRepositories()
      if (body.title !== undefined) server.title = body.title
      if (body.description !== undefined) server.description = body.description

      // --- Save the updated server
      await McpServer.save(server)
    },
  )
}
