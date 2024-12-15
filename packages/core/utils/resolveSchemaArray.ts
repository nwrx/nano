import type { OpenAPIV3 } from 'openapi-types'
import type { ReferenceResolver } from './resolveReference'
import { ERRORS as E } from './errors'
import { resolveSchemaValue } from './resolveSchemaValue'

export async function resolveSchemaArray(value: unknown, schema: OpenAPIV3.ArraySchemaObject, resolvers: ReferenceResolver[] = []): Promise<unknown[]> {
  if (!Array.isArray(value)) throw E.INPUT_NOT_ARRAY()

  // --- Assert minItems.
  if (schema.minItems !== undefined && value.length < schema.minItems)
    throw E.INPUT_ARRAY_TOO_SHORT(schema.minItems)

  // --- Assert maxItems.
  if (schema.maxItems !== undefined && value.length > schema.maxItems)
    throw E.INPUT_ARRAY_TOO_LONG(schema.maxItems)

  // --- Assert uniqueItems.
  if (schema.uniqueItems === true) {
    const unique = new Set(value)
    if (unique.size !== value.length) throw E.INPUT_ARRAY_NOT_UNIQUE()
  }

  // --- Resolve and assert each item in the array.
  const promises = value.map(x => resolveSchemaValue(x, schema.items as OpenAPIV3.SchemaObject, resolvers))
  return await Promise.all(promises)
}
