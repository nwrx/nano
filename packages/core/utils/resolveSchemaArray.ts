/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import type { Schema } from './defineComponent'
import type { ReferenceResolver } from './resolveReference'
import { ERRORS as E } from './errors'
import { resolveSchema } from './resolveSchema'

export async function resolveSchemaArray(
  path: string,
  value: unknown,
  schema: Schema,
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
  const promises = value.map(async(value, index) => {
    const nestedPath = `${path}[${index}]`
    return await resolveSchema(nestedPath, value, schema.items ?? {}, resolvers)
  })

  // --- Check if the `items` schema excepts an array of arrays.
  const expectNestedArrays = !schema.items
    || schema.items.type === 'array'
    || schema.items.anyOf?.some(s => s.type === 'array')
    || schema.items.oneOf?.some(s => s.type === 'array')

  // --- Resolve all items in parallel.
  const resolved = await Promise.all(promises)
  return expectNestedArrays ? resolved : resolved.flat()
}
