import type { McpServerVariable, McpServerVariableObject } from '../entities'
import type { ModuleMcpServerVariable } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleMcpPool } from '../../mcpPool'
import { ModuleMcpServer } from '../../mcpServer'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { createServerVariable } from '../utils'

export function mcpServerVariableCreate(this: ModuleMcpServerVariable) {
  return createHttpRoute(
    {
      name: 'POST /api/workspaces/:workspace/pools/:pool/servers/:server/variables',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        pool: assert.stringNotEmpty,
        server: assert.stringNotEmpty,
      }),
      parseBody: createParser({
        variables: assert.arrayOf({
          name: assert.stringNotEmpty,
          value: [[assert.undefined], [assert.stringNotEmpty]],
          variable: [[assert.undefined], [assert.stringNotEmpty]],
          mountAtPath: [[assert.undefined], [assert.stringNotEmpty]],
        }),
      }),
    },
    async({ event, parameters, body }): Promise<McpServerVariableObject[]> => {
      const moduleUser = this.getModule(ModuleUser)
      const modulePool = this.getModule(ModuleMcpPool)
      const moduleServer = this.getModule(ModuleMcpServer)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace, pool and server.
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const pool = await modulePool.getPool({ user, workspace, name: parameters.pool, permission: 'Write' })
      const server = await moduleServer.getServer({ workspace, pool, name: parameters.server })

      // --- Create the MCP server variables.
      const serverVariables: McpServerVariable[] = []
      for (const variable of body.variables) {
        const serverVariable = await createServerVariable.call(this, { user, server, workspace, ...variable })
        serverVariables.push(serverVariable)
      }

      // --- Save and return the MCP server variables.
      const { McpServerVariable } = this.getRepositories()
      await McpServerVariable.save(serverVariables)
      return serverVariables.map(variable => variable.serialize())
    },
  )
}
