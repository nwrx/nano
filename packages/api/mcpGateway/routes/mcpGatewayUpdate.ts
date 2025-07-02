import type { ModuleMcpGateway } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleMcpManager } from '../../mcpManager'
import { ModuleUser } from '../../user'
import { getGateway } from '../utils'

export function mcpGatewayUpdate(this: ModuleMcpGateway) {
  return createHttpRoute(
    {
      name: 'PUT /api/mcp/:manager/gateways/:identity',
      parseParameters: createParser({
        manager: assert.stringNotEmpty,
        identity: assert.stringNotEmpty,
      }),
      parseBody: createParser({
        address: [[assert.undefined], [assert.stringNotEmpty]],
      }),
    },
    async({ event, parameters, body }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleManager = this.getModule(ModuleMcpManager)
      const { user } = await moduleUser.authenticate(event)
      const { address } = body

      // --- Get the MCP gateway by manager and identity
      const manager = await moduleManager.getManager({ user, identity: parameters.manager })
      const gateway = await getGateway.call(this, { user, manager, identity: parameters.identity })
      if (address) gateway.address = address
      gateway.updatedBy = user

      // --- Save and return the updated record.
      const { McpGateway } = this.getRepositories()
      await McpGateway.save(gateway)
    },
  )
}
