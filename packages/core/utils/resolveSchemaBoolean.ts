import { ERRORS as E } from './errors'

export function resolveSchemaBoolean(path: string, value: unknown): boolean {
  if (typeof value !== 'boolean') throw E.INPUT_NOT_BOOLEAN(path)
  return value
}
