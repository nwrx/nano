import type { ModuleMcpPool } from '..'
import type { McpPoolStatus } from '../utils'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleMcpManager } from '../../mcpManager'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getMcpPool, getMcpPoolManager } from '../utils'

export function mcpPoolStatus(this: ModuleMcpPool) {
  return createHttpRoute(
    {
      name: 'GET /api/workspaces/:workspace/pools/:pool/status',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        pool: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters }): Promise<McpPoolStatus> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const moduleManager = this.getModule(ModuleMcpManager)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace and pool.
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const pool = await getMcpPool.call(this, {
        user,
        workspace,
        name: parameters.pool,
        permission: 'Read',
        withManager: true,
      })

      // --- Get the status via the MCP pool manager client.
      const manager = await getMcpPoolManager.call(this, { workspace, pool })
      const client = moduleManager.getManagerClient(manager)
      const remote = await client.getPool(pool.id)

      // --- Check if all the specs are synchronized.
      const isSynchronized = pool.spec.defaultIdleTimeout === remote.defaultIdleTimeout
        && pool.spec.maxServersActive === remote.maxServersActive
        && pool.spec.maxServersLimit === remote.maxServersLimit

      // --- Return the MCP pool status.
      return {
        isSynchronized,
        ...remote.status,
        localSpec: pool.spec,
        remoteSpec: {
          defaultIdleTimeout: remote.defaultIdleTimeout,
          maxServersActive: remote.maxServersActive,
          maxServersLimit: remote.maxServersLimit,
        },
      }
    },
  )
}
