import type { McpServerVariableObject } from '../entities'
import type { ModuleMcpServerVariable } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleMcpPool } from '../../mcpPool'
import { ModuleMcpServer } from '../../mcpServer'
import { ModuleUser } from '../../user'
import { ModuleVault } from '../../vault'
import { ModuleWorkspace } from '../../workspace'
import { createMcpServerVariable } from '../utils'

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
        name: assert.stringNotEmpty,
        value: [[assert.undefined], [assert.stringNotEmpty]],
        variable: [[assert.undefined], [assert.stringNotEmpty]],
        mountAtPath: [[assert.undefined], [assert.stringNotEmpty]],
      }),
    },
    async({ event, parameters, body }): Promise<McpServerVariableObject> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleVault = this.getModule(ModuleVault)
      const modulePool = this.getModule(ModuleMcpPool)
      const moduleServer = this.getModule(ModuleMcpServer)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace, pool and server.
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const pool = await modulePool.getPool({ user, workspace, name: parameters.pool, permission: 'Write' })
      const server = await moduleServer.getServer({ workspace, pool, name: parameters.server })

      // --- Assert that either value or variable is provided, but not both.
      if (body.value && body.variable)
        throw this.errors.MCP_SERVER_VARIABLE_INVALID_SOURCE()

      // --- Create the MCP server variable
      if (body.value) {
        const { name, value, mountAtPath } = body
        const entity = await createMcpServerVariable.call(this, { user, server, name, value, mountAtPath })
        return entity.serialize()
      }

      // --- If a vault variable is provided, we need to fetch it.
      if (body.variable) {
        const { name, variable, mountAtPath } = body
        const [vaultName, variableName] = variable.split('/')
        const vault = await moduleVault.getVault({ user, workspace, name: vaultName, permission: 'Read' })
        const vaultVariable = await moduleVault.getVariable({ workspace, vault, name: variableName })
        const entity = await createMcpServerVariable.call(this, { user, server, name, variable: vaultVariable, mountAtPath })
        return entity.serialize()
      }

      // --- If neither value nor variable is provided, throw an error.
      throw this.errors.MCP_SERVER_VARIABLE_INVALID_SOURCE()
    },
  )
}
