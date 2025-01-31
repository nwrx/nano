import type { ModuleFlow } from '..'
import { createRoute } from '@unserved/server'
import {
  assertNotNull,
  assertNumber,
  assertString,
  assertStringNotEmpty,
  assertStringUuid,
  assertUndefined,
  createSchema,
} from '@unshared/validation'

function assertStringEquals<T extends string>(expect: T) {
  return (value: unknown): asserts value is T => {
    if (typeof value !== 'string') throw new Error('Expected a string')
    if (value !== expect) throw new Error('Expected a string')
  }
}

export function flowEdit(this: ModuleFlow) {
  return createRoute(
    {
      name: 'WS /api/flows/editor',
      parseMessage: createSchema({
        id: assertStringUuid,
        data: [

          // --- Flow events.
          [createSchema({
            event: assertStringEquals('refreshFlow'),
          })],
          [createSchema({
            event: assertStringEquals('updateSettings'),
            name: [[assertUndefined], [assertStringNotEmpty]],
            icon: [[assertUndefined], [assertStringNotEmpty]],
            description: [[assertUndefined], [assertString]],
          })],

          // --- Node events.
          [createSchema({
            event: assertStringEquals('createNode'),
            kind: assertStringNotEmpty,
            x: assertNumber,
            y: assertNumber,
          })],
          [createSchema({
            event: assertStringEquals('moveNode'),
            nodeId: assertStringNotEmpty,
            x: assertNumber,
            y: assertNumber,
          })],
          [createSchema({
            event: assertStringEquals('setNodeDataValue'),
            nodeId: assertStringNotEmpty,
            portId: assertStringNotEmpty,
            value: assertNotNull,
          })],
          [createSchema({
            event: assertStringEquals('removeNode'),
            nodeId: assertStringNotEmpty,
          })],

          // --- Link events.
          [createSchema({
            event: assertStringEquals('createLink'),
            source: assertStringNotEmpty,
            target: assertStringNotEmpty,
          })],
          [createSchema({
            event: assertStringEquals('removeLink'),
            source: assertStringNotEmpty,
          })],
        ],
      }),
    },
    {
      onMessage: async({ peer, payload }) => {
        const { id, data } = payload

        // --- Resolve the flow.
        const session = await this.resolveFlowSession(id)
        session.subscribe(peer)

        // --- Flow events.
        if (data.event === 'refreshFlow')
          peer.send({ event: 'flow:refresh', data: session.flow.toJSON() })
        if (data.event === 'updateSettings')
          session.flow.setSettings(data)

        // --- Node events.
        if (data.event === 'createNode')
          await session.flow.createNode(data.kind, { position: { x: data.x, y: data.y } })
        if (data.event === 'moveNode')
          session.flow.moveNode(data.nodeId, data.x, data.y)
        if (data.event === 'setNodeDataValue')
          await session.flow.setNodeDataValue(data.nodeId, data.portId, data.value)
        if (data.event === 'removeNode')
          session.flow.removeNode(data.nodeId)

        // --- Link events.
        if (data.event === 'createLink')
          session.flow.createLink(data.source, data.target)
        if (data.event === 'removeLink')
          session.flow.removeLink(data.source)
      },

      onClose: ({ peer }) => {
        const session = this.resolveFlowSessionByPeer(peer)
        if (!session) return
        session.unsubscribe(peer)
      },
    },
  )
}
