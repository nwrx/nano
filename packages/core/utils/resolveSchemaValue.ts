import type { OpenAPIV3 } from 'openapi-types'
import type { ReferenceResolver } from './resolveReference'
import { ERRORS as E } from './errors'
import { isReference } from './isReference'
import { resolveReference } from './resolveReference'
import { resolveSchemaArray } from './resolveSchemaArray'
import { resolveSchemaBoolean } from './resolveSchemaBoolean'
import { resolveSchemaNumber } from './resolveSchemaNumber'
import { resolveSchemaObject } from './resolveSchemaObject'
import { resolveSchemaOneOf } from './resolveSchemaOneOf'
import { resolveSchemaString } from './resolveSchemaString'

export async function resolveSchemaValue(value: unknown, schema: OpenAPIV3.SchemaObject, resolvers: ReferenceResolver[] = []): Promise<unknown> {
  if (isReference(value)) value = await resolveReference(value, resolvers)

  // --- Assert that the value is not undefined or null.
  if (value === undefined || value === null) {
    if ('x-optional' in schema && schema['x-optional'] === true) return schema.default
    throw E.INPUT_REQUIRED()
  }

  // --- Resolve the value based on the schema type.
  else if (schema.oneOf) { return resolveSchemaOneOf(value, schema.oneOf as OpenAPIV3.SchemaObject[], resolvers) }
  else if (schema.anyOf) { return resolveSchemaOneOf(value, schema.anyOf as OpenAPIV3.SchemaObject[], resolvers) }
  else if (schema.type === 'string') { return resolveSchemaString(value, schema) }
  else if (schema.type === 'number' || schema.type === 'integer') { return resolveSchemaNumber(value, schema) }
  else if (schema.type === 'boolean') { return resolveSchemaBoolean(value) }
  else if (schema.type === 'array') { return resolveSchemaArray(value, schema, resolvers) }
  else if (schema.type === 'object') { return resolveSchemaObject(value, schema, resolvers) }
  else { return value }
}
