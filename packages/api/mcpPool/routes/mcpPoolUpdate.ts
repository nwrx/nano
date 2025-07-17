import type { ModuleMcpPool } from '..'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { assertMcpPoolSpec } from '../utils/assertMcpPoolSpec'

export function mcpPoolUpdate(this: ModuleMcpPool) {
  return createHttpRoute(
    {
      name: 'PUT /api/workspaces/:workspace/pools/:pool',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        pool: assert.stringNotEmpty,
      }),
      parseBody: createParser({
        spec: [[assert.undefined], [assertMcpPoolSpec]],
        title: [[assert.undefined], [assert.string]],
        description: [[assert.undefined], [assert.string]],
      }),
    },
    async({ event, parameters, body }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace and pool.
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const pool = await this.getPool({ user, workspace, name: parameters.pool, permission: 'Write' })

      // --- Update the MCP pool
      const { McpPool } = this.getRepositories()
      await McpPool.update({ id: pool.id }, {
        spec: body.spec ?? pool.spec,
        title: body.title ?? pool.title,
        description: body.description ?? pool.description,
        updatedBy: user,
      })
    },
  )
}
