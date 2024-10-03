import type { ModuleFlow } from '..'
import { createRoute } from '@unserved/server'
import { assertNotNull, assertNumber, assertStringNotEmpty, createArrayParser, createAssertStringEquals, createParser, createRuleSet, createSchema } from '@unshared/validation'
import { nextTick } from 'node:process'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'

export function flowSession(this: ModuleFlow) {
  return createRoute(
    {
      name: 'WS /ws/workspaces/:workspace/:project/:flow',
      parameters: createSchema({
        workspace: assertStringNotEmpty,
        project: assertStringNotEmpty,
        flow: assertStringNotEmpty,
      }),
      message: createRuleSet(

        // --- User events.
        [createSchema({
          event: createAssertStringEquals('userJoin'),
          token: assertStringNotEmpty,
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
      ),
    },
    {

      /**
       * When a WebSocket connection is opened, the peer information is extracted and
       * used to authenticate the user. Once the user is authenticated, the flow session
       * can be authorized and either created or retrieved from the in-memory set of sessions.
       *
       * @param context The context of the WebSocket connection.
       * @param context.peer The peer that connected to the WebSocket.
       * @param context.parameters The parameters of the WebSocket connection.
       */
      onOpen: async({ peer, parameters }) => {
        const userModule = this.getModule(ModuleUser)
        const workspaceModule = this.getModule(ModuleWorkspace)
        const { user } = await userModule.authenticate(peer)
        const { workspace: ws, project, flow } = parameters

        // --- Resolve the flow and check if the user has access to it.
        const workspaceResolved = await workspaceModule.resolveWorkspace({ user, name: ws, permission: 'Read' })
        const projectResolved = await workspaceModule.resolveProject({ workspace: workspaceResolved, name: project, permission: 'Read' })
        const flowResolved = await this.resolveFlow({ name: flow, project: projectResolved, workspace: workspaceResolved })
        if (!flowResolved) throw this.errors.FLOW_NOT_FOUND(ws, project, flow)

        // --- Create or retrieve the flow session and subscribe the peer to it.
        const session = await this.resolveFlowSession(flowResolved)
        session.subscribe(peer, user)
      },

      onError: ({ peer, error }) => {
        peer.send({ event: 'error', message: error.message })
      },

      onClose: ({ peer }) => {
        const session = this.resolveFlowSessionByPeer(peer)
        if (session) session.unsubscribe(peer)
      },

      onMessage: async({ peer, message }) => {
        try {
          const { Flow } = this.getRepositories()
          const session = this.resolveFlowSessionByPeer(peer)
          if (!session) return

          switch (message.event) {

            // --- User events.
            case 'userLeave': {
              session.unsubscribe(peer)
              break
            }
            case 'userSetPosition': {
              const { x, y } = message
              session.broadcast({ event: 'user:position', id: peer.id, x, y })
              break
            }

            // --- Flow events.
            case 'flowSetMetaValue': {
              const { key, value } = message
              session.flow.setMetaValue(key, value)
              if (session.flow.meta.name) session.entity.title = session.flow.meta.name
              if (session.flow.meta.description) session.entity.description = session.flow.meta.description
              await Flow.save(session.entity)
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
              const { kind, x, y } = message
              await session.flow.nodeCreate(kind, {
                meta: { position: { x, y } },
                initialData: {},
                initialResult: {},
              })
              await Flow.save(session.entity)
              break
            }
            case 'nodeDuplicate': {
              const { nodeId, x, y } = message
              const instance = session.flow.getNodeInstance(nodeId)
              const kind = `${instance.flow.resolveNodeModule(instance).kind}:${instance.node.kind}`
              await session.flow.nodeCreate(kind, {
                meta: { position: { x, y } },
                initialData: instance.data,
                initialResult: instance.result,
              })
              await Flow.save(session.entity)
              break
            }
            case 'nodeStart': {
              const { nodeId } = message
              const node = session.flow.getNodeInstance(nodeId)
              session.flow.run()
              nextTick(() => node.dispatch('data', node.data))
              break
            }
            case 'nodeAbort': {
              const { nodeId } = message
              session.flow.getNodeInstance(nodeId).abort()
              break
            }
            case 'nodeSetDataValue': {
              const { nodeId, portId, value } = message
              if (typeof value === 'string' && value.startsWith('$NODE.')) return
              if (typeof value === 'string' && value.startsWith('$ENV.')) return
              await session.flow.getNodeInstance(nodeId).setDataValue(portId, value)
              await Flow.save(session.entity)
              break
            }
            case 'nodeSetMetaValue': {
              for (const { nodeId, key, value } of message.nodes) {
                if (key === 'position') createParser({ x: assertNumber, y: assertNumber })(value)
                session.flow.getNodeInstance(nodeId).setMetaValue(key, value)
              }
              await Flow.save(session.entity)
              break
            }
            case 'nodesRemove': {
              const { nodeIds } = message
              for (const nodeId of nodeIds) {
                session.flow.getNodeInstance(nodeId).abort()
                session.flow.nodeRemove(nodeId)
              }
              await Flow.save(session.entity)
              break
            }

            // --- Link events.
            case 'linkCreate': {
              const { source, target } = message
              session.flow.linkCreate(source, target)
              await Flow.save(session.entity)
              break
            }
            case 'linkRemove': {
              const { source } = message
              session.flow.linkRemove(source)
              await Flow.save(session.entity)
              break
            }
          }
        }

        // --- When an error occurs, send an error message to the client
        // --- so it can be displayed in the UI to the user. This is useful
        // --- for debugging purposes and to inform the user of what went wrong.
        catch (error) {
          const message = error instanceof Error ? error.message : 'An error occurred.'
          peer.send({ event: 'error', message })
        }
      },
    },
  )
}
