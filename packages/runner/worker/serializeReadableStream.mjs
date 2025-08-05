/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable jsdoc/no-types */
import { MessageChannel } from 'node:worker_threads'
import { serializeError } from './serializeError.mjs'

/**
 * @typedef SerializedReadableStream
 * @type {import('./deserializeReadableStream').SerializedReadableStream}
 *
 * @typedef SerializedReadableStreamMessage
 * @type {import('./deserializeReadableStream').SerializedReadableStreamMessage}
 */

/**
 * Wraps a Node.js `Readable` stream into a `MessagePort` for IPC communication.
 *
 * @param {ReadableStream} stream The ReadableStream to serialize.
 * @returns {SerializedReadableStream} An object that can be sent over IPC to the consumer.
 */
export function serializeReadableStream(stream) {
  const { port1, port2 } = new MessageChannel()

  /** @type {ReadableStreamDefaultReader | undefined} */
  let reader

  // --- Listen for a `read` event from the consumer. Upon receiving the event, read
  // --- from the stream and send the data to the consumer. If the stream is done, send
  // --- an `end` event to the consumer.
  port2.on('message', async(event) => {
    try {
      reader ??= stream.getReader()
      if (event !== 'read') return
      const { done, value } = await reader.read()
      const /** @type {SerializedReadableStreamMessage} */ message = done
        ? { event: 'end' }
        : { event: 'data', value }
      port2.postMessage(message)
    }
    catch (error) {

      /** @type {SerializedReadableStreamMessage} */
      const message = { event: 'error', error: serializeError(error) }
      port2.postMessage(message)
    }
  })

  return {
    '@instanceOf': 'ReadableStream',
    'port': port1,
  }
}
