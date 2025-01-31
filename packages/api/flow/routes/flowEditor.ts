import type { ModuleFlow } from '..'
import { createWebSocketRoute } from '@unserved/server'
import { assert, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { EDITOR_SESSION_CLIENT_MESSAGE_SCHEMA, resolveSession, resolveSessionByPeer } from '../utils'

export function flowEditor(this: ModuleFlow) {
  return createWebSocketRoute(
    {
      name: 'WS /ws/workspaces/:workspace/:project/:name/editor',
      parseParameters: createSchema({
        workspace: assert.stringNotEmpty.with('Workspace name is required.'),
        project: assert.stringNotEmpty.with('Project name is required.'),
        name: assert.stringNotEmpty.with('Flow name is required.'),
      }),
      parseClientMessage: EDITOR_SESSION_CLIENT_MESSAGE_SCHEMA,
    },
    {
      onOpen: async({ peer, parameters }) => {
        try {
          const userModule = this.getModule(ModuleUser)
          const { user } = await userModule.authenticate(peer)
          const session = await resolveSession.call(this, { ...parameters, user })
          await session.subscribe(peer, user)
        }
        catch (error) {
          const message = error instanceof Error ? error.message : String(error)
          peer.send({ event: 'error', message: `Error while opening session: ${message}` })
          console.error(error)
        }
      },

      onError: ({ peer, error }) => {
        peer.send({ event: 'error', message: error.message })
      },

      onClose: ({ peer }) => {
        const session = resolveSessionByPeer.call(this, peer)
        session.unsubscribe(peer)
      },

      onMessage: async({ peer, message }) => {
        const session = resolveSessionByPeer.call(this, peer)
        peer.send({ event: 'message', message: 'Received message.' })
        await session.onMessage(peer, message)
      },
    },
  )
}
