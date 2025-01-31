import type { OpenAPIV3 } from 'openapi-types'
import type { ReferenceResolver } from './resolveReference'
import { ERRORS as E } from './errors'
import { resolveSchema } from './resolveSchema'

export async function resolveSchemaArray(
  path: string,
  value: unknown,
  schema: OpenAPIV3.ArraySchemaObject,
  resolvers: ReferenceResolver[] = [],
): Promise<unknown[]> {
  if (!Array.isArray(value)) throw E.INPUT_NOT_ARRAY(path)

  // --- Assert minItems.
  if (schema.minItems !== undefined && value.length < schema.minItems)
    throw E.INPUT_ARRAY_TOO_SHORT(path, schema.minItems)

  // --- Assert maxItems.
  if (schema.maxItems !== undefined && value.length > schema.maxItems)
    throw E.INPUT_ARRAY_TOO_LONG(path, schema.maxItems)

  // --- Assert uniqueItems.
  if (schema.uniqueItems === true) {
    const extra = new Set<string>()
    const unique = new Set<string>()
    for (const item of value) {
      const json = JSON.stringify(item)
      if (unique.has(json)) extra.add(json)
      unique.add(json)
    }
    if (extra.size > 0) throw E.INPUT_ARRAY_NOT_UNIQUE(path, [...extra])
  }

  // --- Resolve and assert each item in the array.
  const promises = value.map((value, index) => {
    const nestedPath = `${path}[${index}]`
    return resolveSchema(nestedPath, value, schema.items as OpenAPIV3.SchemaObject, resolvers)
  })
  return await Promise.all(promises)
}
