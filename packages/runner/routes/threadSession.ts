import type { ModuleRunner } from '..'
import type { ThreadWorkerMessage } from '../worker'
import { createWebSocketRoute } from '@unserved/server'
import { assertObjectStrict } from '@unshared/validation'
import { createThreadWorkerSession, THREAD_CLIENT_MESSAGE_SCHEMA } from '../worker'

export function threadSession(this: ModuleRunner) {
  return createWebSocketRoute(
    {
      name: 'WS /thread',
      parseClientMessage: THREAD_CLIENT_MESSAGE_SCHEMA,
      parseServerMessage: assertObjectStrict<ThreadWorkerMessage>,
    },
    {
      onMessage: async({ peer, message }) => {

        // --- Get the thread session for the given peer. If it doesn't exist, create a new one.
        let thread = this.runnerSessions.get(peer.id)
        if (!thread) {
          thread = createThreadWorkerSession.call(this)
          this.runnerSessions.set(peer.id, thread)
          thread.port.on('message', message => peer.send(message))
          peer.send({ event: 'worker:ready', data: { id: peer.id } } as ThreadWorkerMessage)
        }

        // --- Handle the message event.
        if (message.event === 'create') await thread.create(message.data)
        if (message.event === 'start') await thread.start(message.data)
        if (message.event === 'abort') await thread.abort()
      },
      onError: ({ peer, error }) => {
        peer.send({ event: 'error', data: [error as Error] } as ThreadWorkerMessage)
      },
    },
  )
}
