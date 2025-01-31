/* eslint-disable sonarjs/cognitive-complexity */
import type { OpenAPIV3 } from 'openapi-types'
import type { ReferenceResolver } from './resolveReference'
import { ERRORS as E } from './errors'
import { resolveSchemaValue } from './resolveSchemaValue'

export async function resolveSchemaObject(
  value: unknown,
  schema: OpenAPIV3.SchemaObject,
  resolvers: ReferenceResolver[] = [],
): Promise<Record<string, unknown>> {
  if (typeof value !== 'object' || value === null) throw E.INPUT_NOT_OBJECT()
  const resolved: Record<string, unknown> = {}

  // --- Resolve each property in the object.
  for (const key in schema.properties) {
    const propertySchema = schema.properties[key] as OpenAPIV3.SchemaObject
    const propertyValue = (value as Record<string, unknown>)[key]
    resolved[key] = await resolveSchemaValue(propertyValue, propertySchema, resolvers)
  }

  // --- Assert required properties.
  if (schema.required) {
    const missing: string[] = []
    for (const key of schema.required) if (resolved[key] === undefined) missing.push(key)
    if (missing.length > 0) throw E.INPUT_OBJECT_MISSING_PROPERTIES(missing)
  }

  // --- Assert no additional properties.
  if (schema.additionalProperties === false && schema.properties) {
    const expected = Object.keys(schema.properties)
    const extra = Object.keys(value).filter(key => !expected.includes(key))
    if (extra.length > 0) throw E.INPUT_OBJECT_EXTRA_PROPERTIES(extra)
  }

  // --- Resolve additional properties schema.
  if (typeof schema.additionalProperties === 'object' && schema.additionalProperties !== null) {
    const additionalSchema = schema.additionalProperties as OpenAPIV3.SchemaObject
    for (const key in value) {
      if (schema.properties && key in schema.properties) continue
      const propertyValue = (value as Record<string, unknown>)[key]
      resolved[key] = await resolveSchemaValue(propertyValue, additionalSchema, resolvers)
    }
  }

  // --- Resolve additional properties as true.
  if (schema.additionalProperties === true) {
    for (const key in value) {
      if (schema.properties && key in schema.properties) continue
      const propertyValue = (value as Record<string, unknown>)[key]
      resolved[key] = await resolveSchemaValue(propertyValue, {}, resolvers)
    }
  }

  // --- Assert minProperties.
  if (schema.minProperties !== undefined && Object.keys(resolved).length < schema.minProperties)
    throw E.INPUT_OBJECT_TOO_FEW_PROPERTIES(schema.minProperties)

  // --- Assert maxProperties.
  if (schema.maxProperties !== undefined && Object.keys(resolved).length > schema.maxProperties)
    throw E.INPUT_OBJECT_TOO_MANY_PROPERTIES(schema.maxProperties)

  return resolved
}
