import { assertNumber, assertString, assertStringNotEmpty, assertStringUuid, assertUndefined, createSchema } from 'unshared'
import { createRoute } from '@unserved/server'
import { ModuleChain } from '..'

function assertStringEquals<T extends string>(expect: T) {
  return (value: unknown): asserts value is T => {
    if (typeof value !== 'string') throw new Error('Expected a string')
    if (value !== expect) throw new Error('Expected a string')
  }
}

export function chainEdit(this: ModuleChain) {
  return createRoute(
    {
      name: 'WS /api/chains/editor',
      parseMessage: createSchema({
        id: assertStringUuid,
        data: [
          [createSchema({
            event: assertStringEquals('refresh'),
          })],
          [createSchema({
            event: assertStringEquals('createLink'),
            source: assertStringNotEmpty,
            target: assertStringNotEmpty,
          })],
          [createSchema({
            event: assertStringEquals('removeLink'),
            source: assertStringNotEmpty,
          })],
          [createSchema({
            event: assertStringEquals('updateNodePosition'),
            nodeId: assertStringNotEmpty,
            x: assertNumber,
            y: assertNumber,
          })],
          [createSchema({
            event: assertStringEquals('updateSettings'),
            name: [[assertUndefined], [assertStringNotEmpty]],
            icon: [[assertUndefined], [assertStringNotEmpty]],
            description: [[assertUndefined], [assertString]],
          })],
        ],
      }),
    },
    {
      onMessage: async({ peer, payload }) => {
        const { id, data } = payload

        // --- Resolve the chain.
        const session = await this.resolveChainSession(id)
        session.subscribe(peer)

        // --- Handle the event.
        if (data.event === 'refresh')
          peer.send({ event: 'refresh', data: session.chain.toJSON() })
        if (data.event === 'createLink')
          session.chain.createLink(data.source, data.target)
        if (data.event === 'removeLink')
          session.chain.removeLink(data.source)
        if (data.event === 'updateNodePosition')
          session.chain.updateNodePosition(data.nodeId, data.x, data.y)
        if (data.event === 'updateSettings')
          session.chain.setSettings(data)
      },

      onClose: ({ peer }) => {
        const session = this.resolveChainSessionByPeer(peer)
        if (!session) return
        session.unsubscribe(peer)
      },
    },
  )
}
