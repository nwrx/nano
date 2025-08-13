import { ModuleMcpServer } from '../../mcpServer/index'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleMcpPool } from '../../mcpPool'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { ModuleMcpServerVariable } from '..'

export function mcpServerVariableRemove(this: ModuleMcpServerVariable) {
  return createHttpRoute(
    {
      name: 'DELETE /workspaces/:workspace/pools/:pool/servers/:server/variables/:variable',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        pool: assert.stringNotEmpty,
        server: assert.stringNotEmpty,
        variable: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const moduleMcpServer = this.getModule(ModuleMcpServer)
      const modulePool = this.getModule(ModuleMcpPool)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace, pool and server.
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const pool = await modulePool.getPool({ user, workspace, name: parameters.pool, permission: 'Write' })
      const server = await moduleMcpServer.getServer({ workspace, pool, name: parameters.server })

      // --- Remove the MCP server variable
      const { McpServerVariable } = this.getRepositories()
      await McpServerVariable.softDelete({ server, name: parameters.variable })
    },
  )
}
