export interface SerializedError {
  '@instanceOf': 'Error'
  name: string
  stack?: string
  message: string
  context?: Record<string, unknown>
}

/**
 * Unwraps an Ecmascript `Error` from a plain object.
 *
 * @param object The plain object representation of the error.
 * @returns The deserialized error.
 */
export function deserializeError(object: SerializedError): Error {
  const error = new Error(object.message)
  error.stack = object.stack
  error.name = object.name
  return error
}
