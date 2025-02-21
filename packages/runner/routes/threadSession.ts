import type { ModuleRunner } from '../application'
import type { ThreadWorkerMessage } from '../worker'
import { createWebSocketRoute } from '@unserved/server'
import { assertObjectStrict, assertStringUuid, createParser } from '@unshared/validation'
import { authorize } from '../utils'
import { THREAD_CLIENT_MESSAGE_SCHEMA } from '../worker'

export function threadSession(this: ModuleRunner) {
  return createWebSocketRoute(
    {
      name: 'WS /threads/:id',
      parseParameters: createParser({ id: assertStringUuid }),
      parseClientMessage: THREAD_CLIENT_MESSAGE_SCHEMA,
      parseServerMessage: createParser(assertObjectStrict<ThreadWorkerMessage>),
    },
    {
      onOpen: ({ peer, parameters }) => {
        authorize.call(this, peer)
        const thread = this.runnerSessions.get(parameters.id)
        if (!thread) throw this.errors.THREAD_NOT_FOUND(parameters.id)
      },
      onError: ({ peer, error }) => {
        peer.send({ event: 'error', data: [error] } as ThreadWorkerMessage)
      },
      onMessage: async({ message, parameters }) => {
        const thread = this.runnerSessions.get(parameters.id)
        if (!thread) throw this.errors.THREAD_NOT_FOUND(parameters.id)
        if (message.event === 'start') await thread.start(message.data)
        if (message.event === 'abort') await thread.abort()
      },
    },
  )
}
