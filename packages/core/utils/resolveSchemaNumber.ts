import type { SocketSchema } from './defineComponent'
import { ERRORS as E } from './errors'

export function resolveSchemaNumber(path: string, value: unknown, schema: SocketSchema): number {

  // --- Attempt to parse the value as a number.
  if (typeof value !== 'number') {
    value = Number.parseFloat(value as string)
    if (Number.isFinite(value)) return value as number
    throw E.INPUT_NOT_NUMBER(path)
  }

  // --- Assert exclusiveMinimum.
  if (schema.minimum !== undefined && schema.exclusiveMinimum === true && value <= schema.minimum)
    throw E.INPUT_NUMBER_NOT_EXCEED_MINIMUM(path, schema.minimum)

  // --- Assert exclusiveMaximum.
  if (schema.maximum !== undefined && schema.exclusiveMaximum === true && value >= schema.maximum)
    throw E.INPUT_NUNBER_NOT_BELOW_MAXIMUM(path, schema.maximum)

  // --- Assert minimum.
  if (schema.minimum !== undefined && value < schema.minimum)
    throw E.INPUT_NUMBER_TOO_SMALL(path, schema.minimum)

  // --- Assert maximum.
  if (schema.maximum !== undefined && value > schema.maximum)
    throw E.INPUT_NUMBER_TOO_LARGE(path, schema.maximum)

  // --- Assert multipleOf.
  if (schema.multipleOf !== undefined && value % schema.multipleOf !== 0)
    throw E.INPUT_NUMBER_NOT_MULTIPLE_OF(path, schema.multipleOf)

  // --- Assert enums.
  if (schema.enum && !schema.enum.includes(value))
    throw E.INPUT_NOT_IN_ENUM(path, schema.enum as number[])

  // --- Assert integer.
  if (schema.type === 'integer' && !Number.isInteger(value))
    throw E.INPUT_NUMBER_NOT_INTEGER(path)

  return value
}
