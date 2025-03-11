/* eslint-disable jsdoc/no-types */

import { serialize } from './serialize.mjs'

/**
 * @typedef SerializedError
 * @type {import('./deserializeError').SerializedError}
 */

/**
 * Wraps an Ecmascript `Error` into a plain object for serialization.
 *
 * @param {unknown} error The error to serialize.
 * @returns {SerializedError} A plain object representation of the error.
 */
export function serializeError(error) {
  if (error instanceof Error) {
    return {
      '@instanceOf': 'Error',
      'message': error.message,
      'stack': error.stack ?? '',
      'name': error.name,
      // @ts-expect-error: This property is sometimes present.
      'context': serialize(error.context, []),
    }
  }
  return {
    '@instanceOf': 'Error',
    'message': String(error),
    'stack': '',
    'name': 'Error',
  }
}
