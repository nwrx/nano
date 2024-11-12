import type { ModuleFlow } from '..'
import { createRoute } from '@unserved/server'
import { assert, createSchema } from '@unshared/validation'
import { ModuleMonitoring } from '../../monitoring'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { FLOW_SESSION_MESSAGE_SCHEMA, resolveFlowEntity, resolveFlowSession, resolveFlowSessionByPeer } from '../utils'

export function flowSession(this: ModuleFlow) {
  return createRoute(
    {
      name: 'WS /ws/workspaces/:workspace/:project/:flow',
      parameters: createSchema({
        workspace: assert.stringNotEmpty.with('Workspace name is required.'),
        project: assert.stringNotEmpty.with('Project name is required.'),
        flow: assert.stringNotEmpty.with('Flow name is required.'),
      }),
      message: FLOW_SESSION_MESSAGE_SCHEMA,
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
        try {
          const userModule = this.getModule(ModuleUser)
          const workspaceModule = this.getModule(ModuleWorkspace)
          const monitoringModule = this.getModule(ModuleMonitoring)
          const { user } = await userModule.authenticate(peer)
          const { workspace: workspaceName, project: projectName, flow: flowName } = parameters

          // --- Resolve the flow and check if the user has access to it.
          const workspace = await workspaceModule.resolveWorkspace({ user, name: workspaceName, permission: 'Read' })
          const project = await workspaceModule.resolveProject({ workspace, name: projectName, permission: 'Read' })
          const flowEntity = await resolveFlowEntity.call(this, { name: flowName, project, workspace })
          if (!flowEntity) throw this.errors.FLOW_NOT_FOUND(workspaceName, projectName, flowName)

          // --- Create or retrieve the flow session and subscribe the peer to it.
          const session = resolveFlowSession.call(this, flowEntity)
          await session.subscribe(peer, user)
          monitoringModule.captureFlowThreadEvents(session.thread, flowEntity)
        }

        // --- When an error occurs, send an error message to the client
        // --- so it can be displayed in the UI to the user. This is useful
        // --- for debugging purposes and to inform the user of what went wrong.
        catch (error) {
          const message = error instanceof Error ? error.message : String(error)
          peer.send({ event: 'error', message: `Error while opening session: ${message}` })
          console.error(error)
        }
      },

      /**
       * When an error occurs, send an error message to the client so it can be displayed
       * in the UI to the user. This is useful for debugging purposes and to inform the user
       * of what went wrong.
       *
       * @param context The context of the WebSocket connection.
       * @param context.peer The peer that connected to the WebSocket.
       * @param context.error The error that occurred.
       */
      onError: ({ peer, error }) => {
        peer.send({ event: 'error', message: error.message })
      },

      /**
       * When a WebSocket connection is closed, the peer information is removed from the
       * flow session and the peer is unsubscribed from it. This ensures that the peer
       * is no longer able to receive updates from the flow session.
       *
       * @param context The context of the WebSocket connection.
       * @param context.peer The peer that connected to the WebSocket.
       */
      onClose: ({ peer }) => {
        const session = resolveFlowSessionByPeer.call(this, peer)
        if (session) session.unsubscribe(peer)
      },

      /**
       * When a message is received from the client, the message is parsed and the event
       * is triggered on the flow session. The flow session will then handle the event
       * and update the flow accordingly. Once the flow has been updated, the changes
       * are broadcasted to the peers so they can be updated in real-time.
       *
       * @param context The context of the WebSocket connection.
       * @param context.peer The peer that connected to the WebSocket.
       * @param context.message The message that was received from the client.
       */
      onMessage: async({ peer, message }) => {
        const session = resolveFlowSessionByPeer.call(this, peer)
        if (!session) throw new Error('Flow session not found for peer')
        await session.onMessage(peer, message)
      },
    },
  )
}
