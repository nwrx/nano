import { createError } from './createError'

export const ERRORS = {

  /***************************************************************************/
  /* Runtime errors.                                                         */
  /***************************************************************************/

  REFERENCE_UNRESOLVED: (ref: string) => createError({
    message: 'The reference could not be resolved',
    name: 'E_REFERENCE_UNRESOLVED',
    context: { ref },
  }),
  REFERENCE_INVALID_FORMAT: () => createError({
    message: 'The reference format is invalid',
    name: 'E_REFERENCE_INVALID_FORMAT',
  }),
  REFERENCE_INVALID_TAG: () => createError({
    message: 'The reference tag is invalid',
    name: 'E_REFERENCE_INVALID_TAG',
  }),
  REFERENCE_INVALID_TYPE: () => createError({
    message: 'The reference type is invalid',
    name: 'E_REFERENCE_INVALID_TYPE',
  }),
  REFERENCE_INVALID_VALUE: () => createError({
    message: 'The reference value is invalid',
    name: 'E_REFERENCE_INVALID_VALUE',
  }),
  REFERENCE_WRONG_TYPE: (type: string, expected: string) => createError({
    message: `The reference type is invalid, expected "${expected}" but got "${type}"`,
    name: 'E_REFERENCE_WRONG_TYPE',
    context: { type, expected },
  }),
  REFERENCE_MISSING_NAME: (ref: string) => createError({
    message: `The reference "${ref}" does not contain a name`,
    name: 'E_REFERENCE_MISSING_NAME',
  }),

  /***************************************************************************/
  /* Input errors.                                                           */
  /***************************************************************************/

  INPUT_REQUIRED: () => createError({
    message: 'The value is required',
    name: 'E_INPUT_REQUIRED',
  }),
  INPUT_NOT_ANY_OF: (errors: Error[]) => createError({
    message: 'The value does not match any of the anyOf schemas',
    name: 'E_NOT_ANY_OF',
    context: { errors },
  }),
  INPUT_NOT_ONE_OF: (errors: Error[]) => createError({
    message: 'The value does not match any of the oneOf schemas',
    name: 'E_NOT_ONE_OF',
    context: { errors },
  }),

  // String errors.
  INPUT_NOT_STRING: () => createError({
    message: 'Expected a string value',
    name: 'E_INPUT_NOT_STRING',
  }),
  INPUT_PATTERN_MISMATCH: (pattern: string) => createError({
    message: 'The value does not match the pattern',
    name: 'E_INPUT_NOT_STRING_PATTERN',
    context: { pattern },
  }),
  INPUT_TOO_SHORT: (minLength: number) => createError({
    message: 'The value is too short',
    name: 'E_INPUT_TOO_SHORT',
    context: { minLength },
  }),
  INPUT_TOO_LONG: (maxLength: number) => createError({
    message: 'The value is too long',
    name: 'E_INPUT_TOO_LONG',
    context: { maxLength },
  }),
  INPUT_NOT_IN_ENUM: (enumerations: Array<number | string>) => createError({
    message: 'The value does not match any of the enumaration values',
    name: 'E_INPUT_NOT_STRING_ENUM',
    context: { enumerations },
  }),

  // Number errors.
  INPUT_NOT_NUMBER: () => createError({
    message: 'Expected a number value',
    name: 'E_INPUT_NOT_NUMBER',
  }),
  INPUT_NOT_EXCEED_MINIMUM: (minimum: number) => createError({
    message: 'The value does not exceed the minimum',
    name: 'E_INPUT_NOT_EXCEED_MINIMUM',
    context: { minimum },
  }),
  INPUT_NOT_BELOW_MAXIMUM: (maximum: number) => createError({
    message: 'The value does not below the maximum',
    name: 'E_INPUT_NOT_BELOW_MAXIMUM',
    context: { maximum },
  }),
  INPUT_TOO_SMALL: (minimum: number) => createError({
    message: 'The value is too small',
    name: 'E_INPUT_TOO_SMALL',
    context: { minimum },
  }),
  INPUT_TOO_LARGE: (maximum: number) => createError({
    message: 'The value is too large',
    name: 'E_INPUT_TOO_LARGE',
    context: { maximum },
  }),
  INPUT_NOT_MULTIPLE_OF: (multipleOf: number) => createError({
    message: 'The value is not a multiple of the number',
    name: 'E_INPUT_NOT_MULTIPLE_OF',
    context: { multipleOf },
  }),
  INPUT_NOT_INTEGER: () => createError({
    message: 'The value is not an integer',
    name: 'E_INPUT_NOT_INTEGER',
  }),

  // Boolean errors.
  INPUT_NOT_BOOLEAN: () => createError({
    message: 'Expected a boolean value',
    name: 'E_INPUT_NOT_BOOLEAN',
  }),

  // Array errors.
  INPUT_NOT_ARRAY: () => createError({
    message: 'Expected an array value',
    name: 'E_INPUT_NOT_ARRAY',
  }),
  INPUT_ARRAY_TOO_SHORT: (minItems: number) => createError({
    message: 'The array is too short',
    name: 'E_INPUT_ARRAY_TOO_SHORT',
    context: { minItems },
  }),
  INPUT_ARRAY_TOO_LONG: (maxItems: number) => createError({
    message: 'The array is too long',
    name: 'E_INPUT_ARRAY_TOO_LONG',
    context: { maxItems },
  }),
  INPUT_ARRAY_NOT_UNIQUE: () => createError({
    message: 'The array is not unique',
    name: 'E_INPUT_ARRAY_NOT_UNIQUE',
  }),

  // Object errors.
  INPUT_NOT_OBJECT: () => createError({
    message: 'Expected an object value',
    name: 'E_INPUT_NOT_OBJECT',
  }),
  INPUT_OBJECT_TOO_FEW_PROPERTIES: (minProperties: number) => createError({
    message: 'The object has too few properties',
    name: 'E_INPUT_OBJECT_TOO_FEW_PROPERTIES',
    context: { minProperties },
  }),
  INPUT_OBJECT_TOO_MANY_PROPERTIES: (maxProperties: number) => createError({
    message: 'The object has too many properties',
    name: 'E_INPUT_OBJECT_TOO_MANY_PROPERTIES',
    context: { maxProperties },
  }),
  INPUT_OBJECT_EXTRA_PROPERTIES: (extra: string[]) => createError({
    message: 'The object has extra properties',
    name: 'E_INPUT_OBJECT_EXTRA_PROPERTIES',
    context: { extra },
  }),
  INPUT_OBJECT_MISSING_PROPERTIES: (missing: string[]) => createError({
    message: 'The object is missing properties',
    name: 'E_INPUT_OBJECT_MISSING_PROPERTIES',
    context: { missing },
  }),
}
