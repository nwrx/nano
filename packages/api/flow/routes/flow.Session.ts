import type { ModuleFlow } from '..'
import { createRoute } from '@unserved/server'
import { assertNotNull, assertNumber, assertStringNotEmpty, assertStringUuid, createArrayParser, createAssertStringEquals, createParser, createSchema } from '@unshared/validation'
import { nextTick } from 'node:process'
import { serializeFlowSession } from '../utils'

export function flowSession(this: ModuleFlow) {
  return createRoute(
    {
      name: 'WS /api/flows',
      parseMessage: createSchema({
        id: assertStringUuid,
        data: [

          // --- User events.
          [createSchema({
            event: createAssertStringEquals('userJoin'),
            accessToken: assertStringNotEmpty,
          })],
          [createSchema({
            event: createAssertStringEquals('userLeave'),
          })],
          [createSchema({
            event: createAssertStringEquals('userSetPosition'),
            x: assertNumber,
            y: assertNumber,
          })],

          // --- Flow events.
          [createSchema({
            event: createAssertStringEquals('flowSetMetaValue'),
            key: assertStringNotEmpty,
            value: assertNotNull,
          })],
          [createSchema({
            event: createAssertStringEquals('flowRun'),
          })],
          [createSchema({
            event: createAssertStringEquals('flowAbort'),
          })],

          // --- Node events.
          [createSchema({
            event: createAssertStringEquals('nodeCreate'),
            kind: assertStringNotEmpty,
            x: assertNumber,
            y: assertNumber,
          })],
          [createSchema({
            event: createAssertStringEquals('nodeDuplicate'),
            nodeId: assertStringNotEmpty,
            x: assertNumber,
            y: assertNumber,
          })],
          [createSchema({
            event: createAssertStringEquals('nodeStart'),
            nodeId: assertStringNotEmpty,
          })],
          [createSchema({
            event: createAssertStringEquals('nodeAbort'),
            nodeId: assertStringNotEmpty,
          })],
          [createSchema({
            event: createAssertStringEquals('nodeSetMetaValue'),
            nodes: createArrayParser({
              nodeId: assertStringNotEmpty,
              key: assertStringNotEmpty,
              value: assertNotNull,
            }),
          })],
          [createSchema({
            event: createAssertStringEquals('nodeSetDataValue'),
            nodeId: assertStringNotEmpty,
            portId: assertStringNotEmpty,
            value: assertNotNull,
          })],
          [createSchema({
            event: createAssertStringEquals('nodesRemove'),
            nodeIds: createArrayParser(assertStringNotEmpty),
          })],

          // --- Link events.
          [createSchema({
            event: createAssertStringEquals('linkCreate'),
            source: assertStringNotEmpty,
            target: assertStringNotEmpty,
          })],
          [createSchema({
            event: createAssertStringEquals('linkRemove'),
            source: assertStringNotEmpty,
          })],
        ],
      }),
    },
    {
      onError: ({ peer }) => {
        const session = this.resolveFlowSessionByPeer(peer)
        if (!session) return
        peer.send({ event: 'error', data: { message: 'An error occurred.' } })
      },

      onClose: ({ peer }) => {
        const session = this.resolveFlowSessionByPeer(peer)
        if (!session) return
        session.unsubscribe(peer)
      },

      onMessage: async({ peer, payload }) => {
        try {
          const { id, data } = payload
          const session = await this.resolveFlowSession(id)
          switch (data.event) {

            // --- User events.
            case 'userJoin': {
              const { accessToken } = data
              session.subscribe(peer, accessToken)
              peer.send({ event: 'flow:refresh', data: serializeFlowSession(session, peer) })
              break
            }
            case 'userLeave': {
              session.unsubscribe(peer)
              break
            }
            case 'userSetPosition': {
              const { x, y } = data
              session.broadcast('user:position', { id: peer.id, x, y })
              break
            }

            // --- Flow events.
            case 'flowSetMetaValue': {
              const { key, value } = data
              session.flow.setMetaValue(key, value)
              await session.save()
              break
            }
            case 'flowRun': {
              session.flow.run()
              break
            }
            case 'flowAbort': {
              session.flow.abort()
              break
            }

            // --- Node events.
            case 'nodeCreate': {
              const { kind, x, y } = data
              await session.flow.nodeCreate(kind, {
                meta: { position: { x, y } },
                initialData: {},
                initialResult: {},
              })
              await session.save()
              break
            }
            case 'nodeDuplicate': {
              const { nodeId, x, y } = data
              const instance = session.flow.getNodeInstance(nodeId)
              const kind = `${instance.flow.resolveNodeModule(instance).kind}:${instance.node.kind}`
              await session.flow.nodeCreate(kind, {
                meta: { position: { x, y } },
                initialData: instance.data,
                initialResult: instance.result,
              })
              await session.save()
              break
            }
            case 'nodeStart': {
              const { nodeId } = data
              const node = session.flow.getNodeInstance(nodeId)
              session.flow.run()
              nextTick(() => node.dispatch('data', node.data))
              break
            }
            case 'nodeAbort': {
              const { nodeId } = data
              session.flow.getNodeInstance(nodeId).abort()
              break
            }
            case 'nodeSetDataValue': {
              const { nodeId, portId, value } = data
              if (typeof value === 'string' && value.startsWith('$NODE.')) return
              if (typeof value === 'string' && value.startsWith('$ENV.')) return
              await session.flow.getNodeInstance(nodeId).setDataValue(portId, value)
              await session.save()
              break
            }
            case 'nodeSetMetaValue': {
              for (const { nodeId, key, value } of data.nodes) {
                if (key === 'position') createParser({ x: assertNumber, y: assertNumber })(value)
                session.flow.getNodeInstance(nodeId).setMetaValue(key, value)
              }
              await session.save()
              break
            }
            case 'nodesRemove': {
              const { nodeIds } = data
              for (const nodeId of nodeIds) {
                session.flow.getNodeInstance(nodeId).abort()
                session.flow.nodeRemove(nodeId)
              }
              await session.save()
              break
            }

            // --- Link events.
            case 'linkCreate': {
              session.flow.linkCreate(data.source, data.target)
              await session.save()
              break
            }
            case 'linkRemove': {
              session.flow.linkRemove(data.source)
              await session.save()
              break
            }
          }
        }

        // --- When an error occurs, send an error message to the client
        // --- so it can be displayed in the UI to the user. This is useful
        // --- for debugging purposes and to inform the user of what went wrong.
        catch (error) {
          const message = error instanceof Error ? error.message : 'An error occurred.'
          const payload = { event: 'error', data: { message } }
          peer.send(payload)
        }
      },
    },
  )
}
