import type { ModuleMcpPool } from '..'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'

export function mcpPoolRemove(this: ModuleMcpPool) {
  return createHttpRoute(
    {
      name: 'DELETE /api/workspaces/:workspace/pools/:pool',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        pool: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace and pool.
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const pool = await this.getPool({ user, workspace, name: parameters.pool, permission: 'Owner' })
      pool.deletedAt = new Date()
      pool.deletedBy = user

      // --- Delete the MCP pool
      const { McpPool } = this.getRepositories()
      await McpPool.save(pool)
    },
  )
}
