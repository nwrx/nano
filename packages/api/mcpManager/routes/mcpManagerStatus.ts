import type { EventStream } from '@unserved/server'
import type { ModuleMcpManager } from '..'
import type { NmcpManager } from '../utils'
import { createEventStream, createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { getManager, getManagerClient } from '../utils'

export function mcpManagerStatus(this: ModuleMcpManager) {
  return createHttpRoute(
    {
      name: 'GET /mcp/:identity/status',
      parseParameters: createParser({
        identity: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters }): Promise<EventStream<NmcpManager.Status> | NmcpManager.Status> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)
      const { identity } = parameters

      // --- Get manager by identity and it's client.
      const manager = await getManager.call(this, { identity, user })
      const client = getManagerClient.call(this, manager)

      // --- Send as a stream or as a single status.
      const eventStream = createEventStream<NmcpManager.Status>(event)
      client.subscribe(eventStream)
      return eventStream
    },
  )
}
