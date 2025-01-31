import type { MessagePort } from 'node:worker_threads'
import { deserializeError, type SerializedError } from './deserializeError'

export type SerializedReadableStreamMessage =
  | { event: 'data'; value: any }
  | { event: 'end' }
  | { event: 'error'; error: SerializedError }

export interface SerializedReadableStream {
  '@instanceOf': 'ReadableStream'
  port: MessagePort
}

/**
 * Unwraps a Node-like `ReadableStream` from a `MessagePort`. This function
 * will return a web-standard `ReadableStream` that can be consumed by the
 * main thread.
 *
 * @param object The `SerializedReadableStream` object to deserialize.
 * @returns The deserialize `ReadableStream` instance that can be consumed.
 */
export function deserializeReadableStream(object: SerializedReadableStream): ReadableStream {
  const { port } = object
  return new ReadableStream({
    async start(controller) {
      while (true) {
        const promise = new Promise<boolean>((resolve) => {
          port.once('message', (message: SerializedReadableStreamMessage) => {
            if (message.event === 'data') {
              controller.enqueue(message.value)
              resolve(false)
            }
            else if (message.event === 'end') {
              controller.close()
              port.close()
              resolve(true)
            }
            else if (message.event === 'error') {
              const error = deserializeError(message.error)
              controller.error(error)
              port.close()
            }
          })
        })
        port.postMessage('read')
        const done = await promise
        if (done) break
      }
    },
    cancel() {
      port.close()
    },
  })
}
