import type { ModuleRunner } from '../application'
import type { ThreadWorkerMessage } from '../worker'
import { createWebSocketRoute } from '@unserved/server'
import { assertStringNotEmpty, assertStringUuid, createParser } from '@unshared/validation'
import { authorize } from '../utils'
import { THREAD_CLIENT_MESSAGE_SCHEMA, THREAD_SERVER_MESSAGE_SCHEMA } from '../worker'

export function threadSession(this: ModuleRunner) {
  return createWebSocketRoute(
    {
      name: 'WS /threads/:id',
      parseParameters: createParser({ id: assertStringUuid }),
      parseQuery: createParser({ token: assertStringNotEmpty }),
      parseClientMessage: THREAD_CLIENT_MESSAGE_SCHEMA,
      parseServerMessage: THREAD_SERVER_MESSAGE_SCHEMA,
    },
    {
      onOpen: ({ peer, parameters }) => {
        authorize.call(this, peer)
        const worker = this.runnerWorkerPorts.get(parameters.id)
        if (!worker) throw this.errors.THREAD_NOT_FOUND(parameters.id)
        worker.on('message', (message: ThreadWorkerMessage) => peer.send(message))
      },
      onMessage: ({ peer, message, parameters }) => {
        authorize.call(this, peer)
        const worker = this.runnerWorkerPorts.get(parameters.id)
        if (!worker) throw this.errors.THREAD_NOT_FOUND(parameters.id)
        worker.postMessage(message)
      },
      onClose: ({ parameters }) => {
        const worker = this.runnerWorkerPorts.get(parameters?.id)
        if (!worker) return
        worker.close()
        this.runnerWorkerPorts.delete(parameters.id)
      },
      onError: ({ peer, error }) => {
        peer.send({ event: 'error', data: [error] } as ThreadWorkerMessage)
      },
    },
  )
}
