import type { ModuleChat } from '../index'
import { createWebSocketRoute } from '@unserved/server'
import { assertStringNotEmpty, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { CHAT_CLIENT_MESSAGE_SCHEMA, createSession } from '../utils'

export function threadSessionById(this: ModuleChat) {
  return createWebSocketRoute(
    {
      name: 'WS /ws/chat/:workspace',
      parseParameters: createSchema({ workspace: assertStringNotEmpty }),
      parseMessage: CHAT_CLIENT_MESSAGE_SCHEMA,
    },
    {
      onOpen: async({ peer, parameters }) => {
        try {
          const userModule = this.getModule(ModuleUser)
          const { user } = await userModule.authenticate(peer)
          const { workspace } = parameters
          const session = createSession.call(this, { workspace, user })
          this.chatSessions.set(peer.id, session)
          session.subscribe(peer)
        }
        catch (error) {
          peer.send({ event: 'error', message: (error as Error).message })
          console.error(error)
        }
      },
      onMessage: async({ peer, message }) => {
        const session = this.chatSessions.get(peer.id)
        if (!session) throw new Error('The session does not exist.')
        await session.onMessage(peer, message)
      },
      onClose: ({ peer }) => {
        const session = this.chatSessions.get(peer.id)
        if (!session) throw new Error('The session does not exist.')
        session.unsubscribe(peer)
      },
    },
  )
}
