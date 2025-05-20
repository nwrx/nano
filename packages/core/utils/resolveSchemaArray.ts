import type { Schema } from './defineComponent'
import { ERRORS as E } from './errors'
import { isReference } from './isReference'
import { type ReferenceResolver, resolveReference } from './resolveReference'
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

  // --- Resolve every references in the array.
  const valueResolvedPromises = value.map(async(value: unknown) => {
    if (!isReference(value)) return value
    const resolved = await resolveReference(value, resolvers)
    if (resolved === undefined) throw E.REFERENCE_NOT_RESOLVED(path, value)
    return resolved
  })

  // --- If the schema does not expect any kind of nested arrays, we can
  // --- flatten the value to extract the items from the nested arrays.
  const expectNestedArrays = schema.items === undefined
    || schema.items.type === 'array'
    || schema.items.anyOf?.some(s => s.type === 'array')
    || schema.items.oneOf?.some(s => s.type === 'array')

  // --- Resolve all items in parallel.
  const valueResolved = await Promise.all(valueResolvedPromises)
  const valueFlattened = expectNestedArrays ? valueResolved : valueResolved.flat()

  // --- Resolve and assert each item in the array.
  const promises = valueFlattened.map(async(value, index) => {
    const nestedPath = `${path}[${index}]`
    return await resolveSchema(nestedPath, value, schema.items ?? {}, resolvers)
  })

  return await Promise.all(promises)
}
