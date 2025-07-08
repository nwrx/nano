import type { TextGeneration } from './types'

/**
 * Check if a value is a user content-like object.
 *
 * This function checks if the provided value is one of the supported types for user content,
 * which includes string, number, boolean, File, Uint8Array, or ReadableStream.
 *
 * @param value The value to check.
 * @returns True if the value is a user content-like object, false otherwise.
 */
export function isUserContentLike(value: unknown): value is TextGeneration.MessageContentUserLike {
  return (
    typeof value === 'string'
    || typeof value === 'number'
    || typeof value === 'boolean'
    || value instanceof File
    || value instanceof Uint8Array
    || (value instanceof ReadableStream && value.getReader !== undefined)
  )
}
