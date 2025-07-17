import type { ModuleMcpPool } from '..'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { renameMcpPool } from '../utils'

export function mcpPoolRename(this: ModuleMcpPool) {
  return createHttpRoute(
    {
      name: 'PUT /api/workspaces/:workspace/pools/:pool/name',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        pool: assert.stringNotEmpty,
      }),
      parseBody: createParser({
        name: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters, body }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)
      const { name } = body

      // --- Get the workspace and pool.
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const pool = await this.getPool({ user, workspace, name: parameters.pool, permission: 'Owner' })
      await renameMcpPool.call(this, { workspace, pool, name })
    },
  )
}
