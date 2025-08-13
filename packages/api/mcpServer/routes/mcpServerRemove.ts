import type { ModuleMcpServer } from '..'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleMcpPool } from '../../mcpPool'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getMcpServer } from '../utils'

export function mcpServerRemove(this: ModuleMcpServer) {
  return createHttpRoute(
    {
      name: 'DELETE /workspaces/:workspace/pools/:pool/servers/:server',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        pool: assert.stringNotEmpty,
        server: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const modulePool = this.getModule(ModuleMcpPool)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace and pool.
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const pool = await modulePool.getPool({ user, workspace, name: parameters.pool, permission: 'Write' })
      const server = await getMcpServer.call(this, { workspace, pool, name: parameters.server, permission: 'Owner' })

      // --- Remove the MCP server
      const { McpServer } = this.getRepositories()
      await McpServer.remove(server)
    },
  )
}
