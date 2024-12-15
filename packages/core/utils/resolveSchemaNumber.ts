import type { OpenAPIV3 } from 'openapi-types'
import { ERRORS as E } from './errors'

export function resolveSchemaNumber(value: unknown, schema: OpenAPIV3.SchemaObject): number {

  // --- Attempt to parse the value as a number.
  if (typeof value !== 'number') {
    value = Number.parseFloat(value as string)
    if (Number.isFinite(value)) return value as number
    throw E.INPUT_NOT_NUMBER()
  }

  // --- Assert exclusiveMinimum.
  if (schema.minimum !== undefined && schema.exclusiveMinimum === true && value <= schema.minimum)
    throw E.INPUT_NOT_EXCEED_MINIMUM(schema.minimum)

  // --- Assert exclusiveMaximum.
  if (schema.maximum !== undefined && schema.exclusiveMaximum === true && value >= schema.maximum)
    throw E.INPUT_NOT_BELOW_MAXIMUM(schema.maximum)

  // --- Assert minimum.
  if (schema.minimum !== undefined && value < schema.minimum)
    throw E.INPUT_TOO_SMALL(schema.minimum)

  // --- Assert maximum.
  if (schema.maximum !== undefined && value > schema.maximum)
    throw E.INPUT_TOO_LARGE(schema.maximum)

  // --- Assert multipleOf.
  if (schema.multipleOf !== undefined && value % schema.multipleOf !== 0)
    throw E.INPUT_NOT_MULTIPLE_OF(schema.multipleOf)

  // --- Assert enums.
  if (schema.enum && !schema.enum.includes(value))
    throw E.INPUT_NOT_IN_ENUM(schema.enum as number[])

  // --- Assert integer.
  if (schema.type === 'integer' && !Number.isInteger(value))
    throw E.INPUT_NOT_INTEGER()

  return value
}
