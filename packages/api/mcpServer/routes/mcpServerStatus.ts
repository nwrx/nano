import type { ModuleMcpServer } from '..'
import type { McpServerStatus } from '../utils'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleMcpManager } from '../../mcpManager'
import { ModuleMcpPool } from '../../mcpPool'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getMcpServer } from '../utils'

export function mcpServerStatus(this: ModuleMcpServer) {
  return createHttpRoute(
    {
      name: 'GET /api/workspaces/:workspace/pools/:pool/servers/:server/status',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        pool: assert.stringNotEmpty,
        server: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters }): Promise<McpServerStatus> => {
      const moduleUser = this.getModule(ModuleUser)
      const modulePool = this.getModule(ModuleMcpPool)
      const moduleManager = this.getModule(ModuleMcpManager)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace, pool and server.
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const pool = await modulePool.getPool({ user, workspace, name: parameters.pool, permission: 'Read', withManager: true })
      const server = await getMcpServer.call(this, { workspace, pool, name: parameters.server })

      // --- Get the status via the MCP pool manager client.
      const manager = await modulePool.getPoolManager({ workspace, pool })
      const client = moduleManager.getManagerClient(manager)
      const { status, ...remote } = await client.getServer(server.id)

      // --- Check if the server is synchronized.
      const isSynchronized = server.spec.image === remote.image
      return {
        isSynchronized,
        ...status,
        localSpec: server.spec,
        remoteSpec: remote,
      }
    },
  )
}
