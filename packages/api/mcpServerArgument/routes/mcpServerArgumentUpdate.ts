import type { McpServerArgumentObject } from '../entities'
import type { ModuleMcpServerArgument } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleMcpPool } from '../../mcpPool'
import { ModuleMcpServer } from '../../mcpServer'
import { ModuleUser } from '../../user'
import { ModuleVault } from '../../vault'
import { ModuleWorkspace } from '../../workspace'
import { getArgument } from '../utils'

export function mcpServerArgumentUpdate(this: ModuleMcpServerArgument) {
  return createHttpRoute(
    {
      name: 'PUT /api/workspaces/:workspace/pools/:pool/servers/:server/arguments/:position',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        pool: assert.stringNotEmpty,
        server: assert.stringNotEmpty,
        position: [[assert.numberInteger], [assert.stringNumber, Number.parseInt]],
      }),
      parseBody: createParser({
        value: [[assert.undefined], [assert.stringNotEmpty]],
        variable: [[assert.undefined], [assert.stringNotEmpty]],
      }),
    },
    async({ event, parameters, body }): Promise<McpServerArgumentObject> => {
      const moduleUser = this.getModule(ModuleUser)
      const modulePool = this.getModule(ModuleMcpPool)
      const moduleServer = this.getModule(ModuleMcpServer)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace, pool and server.
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const pool = await modulePool.getPool({ user, workspace, name: parameters.pool, permission: 'Write' })
      const server = await moduleServer.getServer({ workspace, pool, name: parameters.server })
      const argument = await getArgument.call(this, { server, position: parameters.position })

      // --- Assert that either value or variable is provided, but not both.
      if (body.value && body.variable)
        throw this.errors.MCP_SERVER_ARGUMENT_INVALID_SOURCE()
      if (!body.value && !body.variable)
        throw this.errors.MCP_SERVER_ARGUMENT_INVALID_SOURCE()

      // --- Update the MCP server argument
      if (body.value) {
        argument.value = body.value
        argument.variable = undefined
      }

      // --- If a vault variable is provided, we need to fetch it.
      if (body.variable) {
        const [vaultName, variableName] = body.variable.split('/')
        const moduleVault = this.getModule(ModuleVault)
        const vault = await moduleVault.getVault({ user, workspace, name: vaultName, permission: 'Read' })
        const variable = await moduleVault.getVariable({ workspace, vault, name: variableName })
        argument.variable = variable
        argument.value = undefined
      }

      // --- Set the updated by user and save.
      argument.updatedBy = user
      const { McpServerArgument } = this.getRepositories()
      await McpServerArgument.save(argument)
      return argument.serialize()
    },
  )
}
