import type { Schema } from './defineComponent'
import { ERRORS as E } from './errors'

export function resolveSchemaString(
  path: string,
  value: unknown,
  schema: Schema,
): string {
  if (typeof value !== 'string')
    throw E.INPUT_NOT_STRING(path)

  // --- Assert pattern.
  if (schema.pattern && !new RegExp(schema.pattern).test(value))
    throw E.INPUT_PATTERN_MISMATCH(path, schema.pattern)

  // --- Assert minLength.
  if (schema.minLength && (value).length < schema.minLength)
    throw E.INPUT_TOO_SHORT(path, schema.minLength)

  // --- Assert maxLength.
  if (schema.maxLength && (value).length > schema.maxLength)
    throw E.INPUT_TOO_LONG(path, schema.maxLength)

  return value
}
