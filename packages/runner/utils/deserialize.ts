import { deserializeError } from './deserializeError.js'
import { deserializeReadableStream } from './deserializeReadableStream.js'
import { isSerializedError } from './isSerializedError.js'
import { isSerializedReadableStream } from './isSerializedReadableStream.js'

/**
 * @param value The value to deserialize.
 * @returns The deserialized value.
 */
export function deserialize(value: unknown): unknown {

  if (isSerializedReadableStream(value))
    return deserializeReadableStream(value)

  if (isSerializedError(value))
    return deserializeError(value)

  if (Array.isArray(value))
    return value.map(x => deserialize(x))

  if (typeof value === 'object' && value !== null && value.constructor === Object) {
    const result: Record<string, unknown> = {}
    for (const key in value) result[key] = deserialize(value[key])
    return result
  }

  return value
}
