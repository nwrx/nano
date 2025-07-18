import type { ModuleMcpServerArgument } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleMcpPool } from '../../mcpPool'
import { ModuleMcpServer } from '../../mcpServer'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'

export function mcpServerArgumentRemove(this: ModuleMcpServerArgument) {
  return createHttpRoute(
    {
      name: 'DELETE /api/workspaces/:workspace/pools/:pool/servers/:server/arguments/:position',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        pool: assert.stringNotEmpty,
        server: assert.stringNotEmpty,
        position: [[assert.numberInteger], [assert.stringNumber, Number.parseInt]],
      }),
    },
    async({ event, parameters }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const modulePool = this.getModule(ModuleMcpPool)
      const moduleServer = this.getModule(ModuleMcpServer)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace, pool and server.
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const pool = await modulePool.getPool({ user, workspace, name: parameters.pool, permission: 'Write' })
      const server = await moduleServer.getServer({ workspace, pool, name: parameters.server })

      // --- Remove the MCP server argument
      const { McpServerArgument } = this.getRepositories()
      await McpServerArgument.delete({ server, position: parameters.position })
    },
  )
}
