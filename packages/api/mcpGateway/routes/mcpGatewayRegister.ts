import type { ModuleMcpGateway } from '..'
import type { McpGatewayObject } from '../entities'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleMcpManager } from '../../mcpManager'
import { ModuleUser } from '../../user'
import { registerGateway } from '../utils'

export function mcpGatewayRegister(this: ModuleMcpGateway) {
  return createHttpRoute(
    {
      name: 'POST /api/mcp/:identity/gateways',
      parseParameters: createParser({
        identity: assert.stringNotEmpty,
      }),
      parseBody: createParser({
        address: assert.stringNotEmpty,
        identity: [[assert.undefined], [assert.stringNotEmpty]],
      }),
    },
    async({ event, parameters, body }): Promise<McpGatewayObject> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleManager = this.getModule(ModuleMcpManager)
      const { user } = await moduleUser.authenticate(event)
      const { address, identity } = body

      // --- Get the gateway by identity and register the gateway.
      const manager = await moduleManager.getManager({ user, identity: parameters.identity })
      const gateway = await registerGateway.call(this, { user, manager, address, identity })

      // --- Return the serialized gateway object.
      return gateway.serialize()
    },
  )
}
