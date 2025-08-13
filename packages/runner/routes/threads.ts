import type { ModuleRunner } from '../application'
import type { ThreadWorkerMessage } from '../worker'
import { createWebSocketRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { authorize } from '../utils'
import { CLIENT_MESSAGE_SCHEMA, createThreadWorker, SERVER_MESSAGE_SCHEMA } from '../worker'
import { serializeError } from '../worker/serializeError.mjs'

export function thread(this: ModuleRunner) {
  return createWebSocketRoute(
    {
      name: 'WS /threads/:id',
      parseParameters: createParser({
        id: assert.stringUuid,
      }),
      parseQuery: createParser({
        token: assert.stringNotEmpty,
      }),
      parseClientMessage: CLIENT_MESSAGE_SCHEMA,
      parseServerMessage: SERVER_MESSAGE_SCHEMA,
    },
    {
      onOpen: ({ peer }) => {
        authorize.call(this, peer)
        const promise = createThreadWorker.call(this)
        this.threads.set(peer.id, promise)
        void promise.then(worker => worker.on('message', message => peer.send(message)))
      },
      onMessage: async({ peer, message }) => {
        const thread = await this.threads.get(peer.id)
        if (!thread) throw this.errors.THREAD_NOT_INSTANTIATED(peer.id)
        thread.postMessage(message)
      },
      onClose: async({ peer }) => {
        const thread = await this.threads.get(peer?.id)
        if (!thread) return
        thread.removeAllListeners()
        thread.unref()
        thread.close()
        this.threads.delete(peer.id)
      },
      onError: ({ peer, error }) => {
        const message: ThreadWorkerMessage = { event: 'worker.error', data: serializeError(error) }
        peer.send(message)
        peer.close(1000, 'Worker error occurred')
      },
    },
  )
}
