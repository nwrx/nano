import type { ModuleRunner } from '../application'
import type { ThreadWorkerMessage } from '../worker'
import { createWebSocketRoute } from '@unserved/server'
import { assertObjectStrict, createParser } from '@unshared/validation'
import { authorize } from '../utils'
import { createThreadWorker, deserialize, THREAD_CLIENT_MESSAGE_SCHEMA } from '../worker'

export function threadSession(this: ModuleRunner) {
  return createWebSocketRoute(
    {
      name: 'WS /threads',
      parseClientMessage: THREAD_CLIENT_MESSAGE_SCHEMA,
      parseServerMessage: createParser(assertObjectStrict<ThreadWorkerMessage>),
    },
    {
      onOpen: ({ peer }) => {
        authorize.call(this, peer)
      },
      onError: ({ peer, error }) => {
        peer.send({ event: 'error', data: [error as Error] } as ThreadWorkerMessage)
      },
      onMessage: async({ peer, message }) => {

        // --- Get the thread session for the given peer. If it doesn't exist, create a new one.
        let thread = this.runnerSessions.get(peer.id)
        if (!thread) {
          thread = createThreadWorker.call(this)
          thread.port.on('message', message => deserialize(peer.send(message)))
          this.runnerSessions.set(peer.id, thread)
        }

        // --- Pass the message to the thread worker.
        if (message.event === 'create') await thread.create(message.data)
        if (message.event === 'start') await thread.start(message.data)
        if (message.event === 'abort') await thread.abort()
      },
    },
  )
}
