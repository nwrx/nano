import type { McpServerArgument, McpServerArgumentObject } from '../entities'
import type { ModuleMcpServerArgument } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleMcpPool } from '../../mcpPool'
import { ModuleMcpServer } from '../../mcpServer'
import { ModuleUser } from '../../user'
import { ModuleVault } from '../../vault'
import { ModuleWorkspace } from '../../workspace'
import { createArgument } from '../utils'

export function mcpServerArgumentCreate(this: ModuleMcpServerArgument) {
  return createHttpRoute(
    {
      name: 'POST /api/workspaces/:workspace/pools/:pool/servers/:server/arguments',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        pool: assert.stringNotEmpty,
        server: assert.stringNotEmpty,
      }),
      parseBody: createParser({
        arguments: assert.arrayOf({
          value: [[assert.undefined], [assert.stringNotEmpty]],
          variable: [[assert.undefined], [assert.stringNotEmpty]],
        }),
      }),
    },
    async({ event, parameters, body }): Promise<McpServerArgumentObject[]> => {
      const moduleUser = this.getModule(ModuleUser)
      const modulePool = this.getModule(ModuleMcpPool)
      const moduleServer = this.getModule(ModuleMcpServer)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace, pool and server.
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const pool = await modulePool.getPool({ user, workspace, name: parameters.pool, permission: 'Write' })
      const server = await moduleServer.getServer({ workspace, pool, name: parameters.server })

      // --- Assert that either value or variable is provided, but not both.
      const args: McpServerArgument[] = []
      for (const argument of body.arguments) {
        if (argument.value && argument.variable)
          throw this.errors.MCP_SERVER_ARGUMENT_INVALID_SOURCE()

        // --- Create the MCP server argument
        if (argument.value) {
          const { value } = argument
          const entity = await createArgument.call(this, { user, server, value })
          args.push(entity)
        }

        // --- If a vault variable is provided, we need to fetch it.
        else if (argument.variable) {
          const [vaultName, variableName] = argument.variable.split('/')
          const moduleVault = this.getModule(ModuleVault)
          const vault = await moduleVault.getVault({ user, workspace, name: vaultName, permission: 'Read' })
          const variable = await moduleVault.getVariable({ workspace, vault, name: variableName })
          const entity = await createArgument.call(this, { user, server, variable })
          args.push(entity)
        }

        // --- If neither value nor variable is provided, throw an error.
        else {
          throw this.errors.MCP_SERVER_ARGUMENT_INVALID_SOURCE()
        }
      }

      // --- Return the serialized arguments
      const { McpServerArgument } = this.getRepositories()
      await McpServerArgument.save(args)
      return args.map(argument => argument.serialize())
    },
  )
}
