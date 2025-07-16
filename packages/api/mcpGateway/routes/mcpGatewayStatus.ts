import type { EventStream } from '@unserved/server'
import type { ModuleMcpGateway } from '../index'
import type { NmcpGateway } from '../utils'
import { createEventStream, createHttpRoute } from '@unserved/server'
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
    async({ event, parameters }): Promise<EventStream<NmcpGateway.Status>> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleManager = this.getModule(ModuleMcpManager)
      const { user } = await moduleUser.authenticate(event)

      // --- Get manager by identity and it's client.
      const manager = await moduleManager.getManager({ user, identity: parameters.manager })
      const gateway = await getGateway.call(this, { user, manager, identity: parameters.identity })
      const client = getGatewayClient.call(this, gateway)

      // --- Send as a stream.
      const eventStream = createEventStream<NmcpGateway.Status>(event)
      client.subscribe(eventStream)
      return eventStream
    },
  )
}
