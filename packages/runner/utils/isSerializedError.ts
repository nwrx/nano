import type { SerializedError } from './deserializeError'

export function isSerializedError(value: unknown): value is SerializedError {
  return typeof value === 'object'
    && value !== null
    && '@instanceOf' in value
    && value['@instanceOf'] === 'Error'
}
