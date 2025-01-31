import type { Schema } from './defineComponent'
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
import { resolveSchemaUndefinedOrNull } from './resolveSchemaUndefinedOrNull'

export async function resolveSchema(
  path: string,
  value: unknown,
  schema: Schema,
  resolvers: ReferenceResolver[] = [],
): Promise<unknown> {
  if (isReference(value)) {
    value = await resolveReference(value, resolvers)
    if (value === undefined) throw E.REFERENCE_NOT_RESOLVED(path)
  }
  if (value === undefined || value === null)
    return resolveSchemaUndefinedOrNull(path, schema)
  else if (schema.oneOf)
    return resolveSchemaOneOf(path, value, schema.oneOf, resolvers)
  else if (schema.anyOf)
    return resolveSchemaOneOf(path, value, schema.anyOf, resolvers)
  else if (schema.type === 'string')
    return resolveSchemaString(path, value, schema)
  else if (schema.type === 'number' || schema.type === 'integer')
    return resolveSchemaNumber(path, value, schema)
  else if (schema.type === 'boolean')
    return resolveSchemaBoolean(path, value)
  else if (schema.type === 'array')
    return resolveSchemaArray(path, value, schema, resolvers)
  else if (schema.type === 'object')
    return resolveSchemaObject(path, value, schema, resolvers)
  return value
}
