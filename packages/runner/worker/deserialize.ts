import { deserializeError } from './deserializeError.js'
import { deserializeReadableStream } from './deserializeReadableStream.js'
import { isSerializedError } from './isSerializedError.js'
import { isSerializedReadableStream } from './isSerializedReadableStream.js'

/**
 * @param value The value to deserialize.
 * @returns The deserialized value.
 */
export function deserialize(value: unknown): unknown {

  // --- Proxy the Port message through a ReadableStream.
  if (isSerializedReadableStream(value))
    return deserializeReadableStream(value)

  // --- Rebuild the `Error` object.
  if (isSerializedError(value))
    return deserializeError(value)

  // --- Recursively deserialize the value if it is an array.
  if (Array.isArray(value))
    return value.map(x => deserialize(x))

  // --- Recursively deserialize the value if it is an object
  if (typeof value === 'object' && value !== null && value.constructor === Object) {
    const result: Record<string, unknown> = {}
    for (const key in value) result[key] = deserialize(value[key as keyof typeof value])
    return result
  }

  // --- Otherwise, return the value as is.
  return value
}
