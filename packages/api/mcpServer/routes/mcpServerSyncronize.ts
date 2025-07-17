import type { ModuleMcpServer } from '..'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleMcpPool } from '../../mcpPool'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getMcpServer, syncronizeMcpServer } from '../utils'

export function mcpServerSyncronize(this: ModuleMcpServer) {
  return createHttpRoute(
    {
      name: 'POST /api/workspaces/:workspace/pools/:pool/servers/:server/synchronize',
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

      // --- Get the workspace, pool and server.
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const pool = await modulePool.getPool({ user, workspace, name: parameters.pool, permission: 'Write', withManager: true })
      const server = await getMcpServer.call(this, { workspace, pool, name: parameters.server })

      // --- Synchronize the MCP server.
      await syncronizeMcpServer.call(this, { workspace, pool, server })
    },
  )
}
