import type { ModuleRunner } from '../application'
import type { ThreadWorkerMessage } from '../worker'
import { createWebSocketRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { authorize } from '../utils'
import { CLIENT_MESSAGE_SCHEMA, createThreadWorker, SERVER_MESSAGE_SCHEMA } from '../worker'

export function thread(this: ModuleRunner) {
  return createWebSocketRoute(
    {
      name: 'WS /threads',
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
        this.runnerWorkerPorts.set(peer.id, promise)
        void promise.then(worker => worker.on('message', message => peer.send(message)))
      },
      onMessage: async({ peer, message }) => {
        const worker = await this.runnerWorkerPorts.get(peer.id)
        if (!worker) throw new Error(`Worker not found for peer: ${peer.id}`)
        worker.postMessage(message)
      },
      onClose: async({ peer }) => {
        const worker = await this.runnerWorkerPorts.get(peer?.id)
        if (!worker) return
        worker.removeAllListeners()
        worker.unref()
        worker.close()
        this.runnerWorkerPorts.delete(peer.id)
      },
      onError: ({ peer, error }) => {
        console.error('Error in thread session:', error)
        const message: ThreadWorkerMessage = { event: 'worker.error', data: error }
        peer.send(message)
        peer.close(1000, 'Worker error occurred')
      },
    },
  )
}
