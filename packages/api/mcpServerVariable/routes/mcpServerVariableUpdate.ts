import type { McpServerVariableObject } from '../entities'
import type { ModuleMcpServerVariable } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleMcpPool } from '../../mcpPool'
import { ModuleMcpServer } from '../../mcpServer'
import { ModuleUser } from '../../user'
import { ModuleVault } from '../../vault'
import { ModuleWorkspace } from '../../workspace'
import { getServerVariable } from '../utils'

export function mcpServerVariableUpdate(this: ModuleMcpServerVariable) {
  return createHttpRoute(
    {
      name: 'PUT /workspaces/:workspace/pools/:pool/servers/:server/variables/:name',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        pool: assert.stringNotEmpty,
        server: assert.stringNotEmpty,
        name: assert.stringNotEmpty,
      }),
      parseBody: createParser({
        value: [[assert.undefined], [assert.stringNotEmpty]],
        variable: [[assert.undefined], [assert.stringNotEmpty]],
        mountAtPath: [[assert.undefined], [assert.stringNotEmpty]],
      }),
    },
    async({ event, parameters, body }): Promise<McpServerVariableObject> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleVault = this.getModule(ModuleVault)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const modulePool = this.getModule(ModuleMcpPool)
      const moduleServer = this.getModule(ModuleMcpServer)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace, pool and server.
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const pool = await modulePool.getPool({ user, workspace, name: parameters.pool, permission: 'Write' })
      const server = await moduleServer.getServer({ workspace, pool, name: parameters.server })
      const variable = await getServerVariable.call(this, { server, name: parameters.name })

      // --- Assert that either value or variable is provided, but not both.
      if (body.value && body.variable)
        throw this.errors.MCP_SERVER_VARIABLE_INVALID_SOURCE()
      if (!body.value && !body.variable)
        throw this.errors.MCP_SERVER_VARIABLE_INVALID_SOURCE()

      // --- Update the MCP server variable
      if (body.value) {
        variable.value = body.value
        variable.variable = undefined
      }

      // --- If a vault variable is provided, we need to fetch it.
      if (body.variable) {
        const [vaultName, variableName] = body.variable.split('/')
        const vault = await moduleVault.getVault({ user, workspace, name: vaultName, permission: 'Read' })
        const vaultVariable = await moduleVault.getVariable({ workspace, vault, name: variableName })
        variable.variable = vaultVariable
        variable.value = undefined
      }

      // --- Update mountAtPath if provided
      if (body.mountAtPath !== undefined)
        variable.mountAtPath = body.mountAtPath

      // --- Set the updated by user and save.
      variable.updatedBy = user
      const { McpServerVariable } = this.getRepositories()
      await McpServerVariable.save(variable)
      return variable.serialize()
    },
  )
}
