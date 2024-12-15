import { ERRORS as E } from './errors'

export function resolveSchemaBoolean(value: unknown): boolean {
  if (typeof value !== 'boolean') throw E.INPUT_NOT_BOOLEAN()
  return value
}
