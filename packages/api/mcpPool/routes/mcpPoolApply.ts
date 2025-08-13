import type { ModuleMcpPool } from '..'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { applyMcpPool } from '../utils'

export function mcpPoolApply(this: ModuleMcpPool) {
  return createHttpRoute(
    {
      name: 'POST /workspaces/:workspace/pools/:pool/apply',
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
      const pool = await this.getPool({ user, workspace, name: parameters.pool, permission: 'Write', withManager: true })

      // --- Synchronize the MCP pool.
      await applyMcpPool.call(this, { user, workspace, pool })
    },
  )
}
