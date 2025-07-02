import type { ModuleMcpGateway } from '../index'
import type { NmcpGateway } from '../utils'
import { createWebSocketRoute } from '@unserved/server'
import { assert, createParser, createRuleSet } from '@unshared/validation'
import { ModuleMcpManager } from '../../mcpManager'
import { ModuleUser } from '../../user'
import { getGateway, getGatewayClient } from '../utils'

export function mcpGatewayStatusSession(this: ModuleMcpGateway) {
  return createWebSocketRoute(
    {
      name: 'WS /wss/mcp/:manager/gateways/:identity/status',
      parseParameters: createParser({
        manager: assert.stringNotEmpty,
        identity: assert.stringNotEmpty,
      }),
      parseServerMessage: createRuleSet([
        assert.object as (value: unknown) => asserts value is NmcpGateway.Status,
      ]),
    },
    {
      onOpen: async({ peer, parameters }) => {
        const moduleUser = this.getModule(ModuleUser)
        const moduleManager = this.getModule(ModuleMcpManager)
        const { user } = await moduleUser.authenticate(peer)
        const manager = await moduleManager.getManager({ user, identity: parameters.manager })
        const gateway = await getGateway.call(this, { user, manager, identity: parameters.identity })
        const client = getGatewayClient.call(this, gateway)
        client.subscribe(peer)
      },
      onClose: async({ peer, parameters }) => {
        const moduleUser = this.getModule(ModuleUser)
        const moduleManager = this.getModule(ModuleMcpManager)
        const { user } = await moduleUser.authenticate(peer)
        const manager = await moduleManager.getManager({ user, identity: parameters.manager })
        const gateway = await getGateway.call(this, { user, manager, identity: parameters.identity })
        const client = getGatewayClient.call(this, gateway)
        client.unsubscribe(peer)
      },
    },
  )
}
