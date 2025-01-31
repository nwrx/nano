/* eslint-disable jsdoc/no-types */
import { serializeError } from './serializeError.mjs'
import { serializeReadableStream } from './serializeReadableStream.mjs'

/**
 * @typedef TransferList
 * @type {import('node:worker_threads').TransferListItem[]}
 */

/**
 * Serializes a value for transfer between worker threads.
 *
 * @param {unknown} value The value to serialize.
 * @param {TransferList} transferList The transfer list to populate.
 * @returns {unknown} The serialized value.
 */
export function serialize(value, transferList) {

  // --- Since we can't transfer class instances, we need to serialize them
  // --- and then re-instantiate them on the other side.
  if (value instanceof Error) {
    return serializeError(value)
  }

  // --- ReadableStream instances can't be transferred either. We need to proxy
  // --- the stream through a MessageChannel and then re-instantiate it on the
  // --- other side.
  else if (value instanceof ReadableStream) {
    const serialized = serializeReadableStream(value)
    transferList.push(serialized.port)
    return serialized
  }

  // --- Serialize nested values in arrays and objects.
  else if (Array.isArray(value)) {
    return value.map(x => serialize(x, transferList))
  }
  else if (typeof value === 'object' && value !== null && value.constructor === Object) {
    const result /** @type {Record<string, unknown>} */ = {}
    // @ts-expect-error: keys are always strings
    for (const key in value) result[key] = serialize(value[key], transferList)
    return result
  }

  // --- Omit functions since can't be transferred.
  else if (typeof value === 'function') {
    return
  }

  // --- Return primitive values as is.
  return value
}
