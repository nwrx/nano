import type { OpenAPIV3 } from 'openapi-types'
import type { InputSocket, OutputSocket } from './defineComponent'
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

export async function resolveSchema(
  path: string,
  value: unknown,
  schema: InputSocket | OutputSocket,
  resolvers: ReferenceResolver[] = [],
): Promise<unknown> {
  if (isReference(value)) {
    value = await resolveReference(value, resolvers)
    if (value === undefined) throw E.REFERENCE_NOT_RESOLVED(path)
  }

  if (value === undefined || value === null) {
    if ('x-optional' in schema && schema['x-optional'] === true) return schema.default
    throw E.INPUT_REQUIRED(path)
  }

  else if (schema.oneOf) {
    return resolveSchemaOneOf(path, value, schema.oneOf as OpenAPIV3.SchemaObject[], resolvers)
  }

  else if (schema.anyOf) {
    return resolveSchemaOneOf(path, value, schema.anyOf as OpenAPIV3.SchemaObject[], resolvers)
  }

  else if (schema.type === 'string') {
    return resolveSchemaString(path, value, schema)
  }

  else if (schema.type === 'number' || schema.type === 'integer') {
    return resolveSchemaNumber(path, value, schema)
  }

  else if (schema.type === 'boolean') {
    return resolveSchemaBoolean(path, value)
  }

  else if (schema.type === 'array') {
    return resolveSchemaArray(path, value, schema, resolvers)
  }

  else if (schema.type === 'object') {
    return resolveSchemaObject(path, value, schema, resolvers)
  }

  return value
}
