import type { ModuleMcpPool } from '..'
import type { McpPoolObject } from '../entities'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { createMcpPool } from '../utils'

export function mcpPoolCreate(this: ModuleMcpPool) {
  return createHttpRoute(
    {
      name: 'POST /api/workspaces/:workspace/pools',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
      }),
      parseBody: createParser({
        name: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters, body }): Promise<McpPoolObject> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace and check write permission.
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Write' })

      // --- Create the MCP pool.
      const { name } = body
      const pool = await createMcpPool.call(this, { workspace, user, name })
      return pool.serialize()
    },
  )
}
