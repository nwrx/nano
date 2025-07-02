import type { ModuleMcpManager } from '..'
import type { NmcpManager } from '../utils'
import { createWebSocketRoute } from '@unserved/server'
import { assert, createParser, createRuleSet } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { getManager, getManagerClient } from '../utils'

export function mcpManagerStatusSession(this: ModuleMcpManager) {
  return createWebSocketRoute(
    {
      name: 'WS /ws/mcp/:identity/status',
      parseParameters: createParser({
        identity: assert.stringNotEmpty,
      }),
      parseServerMessage: createRuleSet([
        assert.object as (value: unknown) => asserts value is NmcpManager.Status,
      ]),
    },
    {
      onOpen: async({ peer, parameters }) => {
        const moduleUser = this.getModule(ModuleUser)
        const { user } = await moduleUser.authenticate(peer)
        const { identity } = parameters
        const manager = await getManager.call(this, { identity, user })
        const client = getManagerClient.call(this, manager)
        client.subscribe(peer)
      },
      onClose: async({ peer, parameters }) => {
        const moduleUser = this.getModule(ModuleUser)
        const { user } = await moduleUser.authenticate(peer)
        const { identity } = parameters
        const manager = await getManager.call(this, { identity, user })
        const client = getManagerClient.call(this, manager)
        client.unsubscribe(peer)
      },
    },
  )
}
