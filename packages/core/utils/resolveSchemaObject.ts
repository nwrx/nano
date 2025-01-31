/* eslint-disable sonarjs/cognitive-complexity */
import type { SocketSchema } from './defineComponent'
import type { ReferenceResolver } from './resolveReference'
import { ERRORS as E } from './errors'
import { resolveSchema } from './resolveSchema'

export async function resolveSchemaObject(
  path: string,
  value: unknown,
  schema: SocketSchema,
  resolvers: ReferenceResolver[] = [],
): Promise<Record<string, unknown>> {
  if (typeof value !== 'object' || value === null) throw E.INPUT_NOT_OBJECT(path)
  const resolved: Record<string, unknown> = {}

  // --- Resolve each property in the object.
  for (const key in schema.properties) {
    const propertySchema = schema.properties[key]
    const propertyValue = (value as Record<string, unknown>)[key]
    const propertyPath = `${path}.${key}`
    resolved[key] = await resolveSchema(propertyPath, propertyValue, propertySchema, resolvers)
  }

  // --- Assert required properties.
  if (schema.required) {
    const missing: string[] = []
    for (const key of schema.required) if (resolved[key] === undefined) missing.push(key)
    if (missing.length > 0) throw E.INPUT_OBJECT_MISSING_PROPERTIES(path, missing)
  }

  // --- Assert no additional properties.
  if (schema.additionalProperties === false && schema.properties) {
    const expected = Object.keys(schema.properties)
    const extra = Object.keys(value).filter(key => !expected.includes(key))
    if (extra.length > 0) throw E.INPUT_OBJECT_EXTRA_PROPERTIES(path, extra)
  }

  // --- Resolve additional properties schema.
  if (typeof schema.additionalProperties === 'object' && schema.additionalProperties !== null) {
    const additionalSchema = schema.additionalProperties
    for (const key in value) {
      if (schema.properties && key in schema.properties) continue
      const propertyValue = (value as Record<string, unknown>)[key]
      const propertyPath = `${path}.${key}`
      resolved[key] = await resolveSchema(propertyPath, propertyValue, additionalSchema, resolvers)
    }
  }

  // --- Resolve additional properties as true.
  if (schema.additionalProperties === true) {
    for (const key in value) {
      if (schema.properties && key in schema.properties) continue
      const propertyValue = (value as Record<string, unknown>)[key]
      const propertyPath = `${path}.${key}`
      resolved[key] = await resolveSchema(propertyPath, propertyValue, {}, resolvers)
    }
  }

  // --- Assert minProperties.
  if (schema.minProperties !== undefined && Object.keys(resolved).length < schema.minProperties)
    throw E.INPUT_OBJECT_TOO_FEW_PROPERTIES(path, schema.minProperties)

  // --- Assert maxProperties.
  if (schema.maxProperties !== undefined && Object.keys(resolved).length > schema.maxProperties)
    throw E.INPUT_OBJECT_TOO_MANY_PROPERTIES(path, schema.maxProperties)

  // --- Return the resolved object. If a `properties` option was given, only return
  // --- the passed properties. Otherwise, return a shallow copy of the object.
  return schema.properties ? resolved : { ...value } as Record<string, unknown>
}
