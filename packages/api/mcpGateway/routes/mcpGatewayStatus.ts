import type { ModuleMcpGateway, NmcpGateway } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleMcpManager } from '../../mcpManager'
import { ModuleUser } from '../../user'
import { getGateway, getGatewayClient } from '../utils'

export function mcpGatewayStatus(this: ModuleMcpGateway) {
  return createHttpRoute(
    {
      name: 'GET /api/mcp/:manager/gateways/:identity/status',
      parseParameters: createParser({
        manager: assert.stringNotEmpty,
        identity: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters }): Promise<NmcpGateway.Status> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleManager = this.getModule(ModuleMcpManager)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the MCP gateway by manager and identity and its client.
      const manager = await moduleManager.getManager({ user, identity: parameters.manager })
      const gateway = await getGateway.call(this, { user, manager, identity: parameters.identity })
      const client = getGatewayClient.call(this, gateway)

      // --- Query and return the status of the MCP gateway.
      return await client.getStatus()
    },
  )
}
