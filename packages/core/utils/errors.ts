import type { SpecifierObject } from './parseSpecifier'
import { dedent } from '@unshared/string'
import { createError } from './createError'
import { serializeSpecifier } from './serializeSpecifier'

export const ERRORS = {

  /***************************************************************************/
  /* Thread errors.                                                          */
  /***************************************************************************/

  THREAD_IS_ALREADY_RUNNING: () => createError({
    message: 'The thread is already running',
    name: 'E_THREAD_IS_ALREADY_RUNNING',
  }),

  /***************************************************************************/
  /* Node errors.                                                            */
  /***************************************************************************/

  NODE_NOT_FOUND: (id: string) => createError({
    message: `The node with the ID "${id}" could not be found`,
    name: 'E_NODE_NOT_FOUND',
    context: { id },
  }),
  NODE_DUPLICATE_ID: (id: string) => createError({
    message: `A node with the ID "${id}" already exists`,
    name: 'E_NODE_DUPLICATE_ID',
    context: { id },
  }),
  NODE_INPUT_SOCKET_NOT_FOUND: (id: string, name: string) => createError({
    message: `The input socket "${name}" does not exist on node "${id}"`,
    name: 'E_NODE_SOCKET_NOT_FOUND',
    context: { id, name },
  }),
  NODE_OUTPUT_SOCKET_NOT_FOUND: (id: string, name: string) => createError({
    message: `The output socket "${name}" does not exist on node "${id}"`,
    name: 'E_NODE_SOCKET_NOT_FOUND',
    context: { id, name },
  }),
  NODE_LINK_SOURCE_NOT_FOUND: (targetId: string, targetName: string, sourceId: string) => createError({
    message: `The node input of node "${targetId}" with the name "${targetName}" references a source node "${sourceId}" that does not exist`,
    name: 'E_NODE_LINK_SOURCE_NOT_FOUND',
    context: { targetId, targetName, sourceId },
  }),

  COMPONENT_INVALID_SPECIFIER_FORMAT: (specifier: string) => createError({
    message: `The component specifier "${specifier}" is invalid`,
    name: 'E_COMPONENT_INVALID_SPECIFIER_FORMAT',
    context: { specifier },
  }),
  COMPONENT_RESOLVED_BUT_NOT_COMPONENT: (specifier: SpecifierObject) => createError({
    message: `The component with specifier "${serializeSpecifier(specifier)}" was resolved but is not a valid component`,
    name: 'E_COMPONENT_RESOLVED_BUT_NOT_COMPONENT',
    context: { specifier },
  }),
  COMPONENT_NOT_RESOLVED: (specifier: SpecifierObject) => createError({
    message: `The component with specifier "${serializeSpecifier(specifier)}" could not be resolved. The specifier does not match any component in the registry`,
    name: 'E_COMPONENT_NOT_RESOLVED',
    context: { specifier },
  }),

  /***************************************************************************/
  /* Parse flow errors.                                                      */
  /***************************************************************************/

  FLOW_VERSION_MISSING: () => createError({
    message: 'Flow file version is missing',
    name: 'E_FLOW_VERSION_MISSING',
  }),
  FLOW_VERSION_UNSUPPORTED: (version: string) => createError({
    message: `Unsupported flow file version: ${version}`,
    name: 'E_FLOW_VERSION_UNSUPPORTED',
    context: { version },
  }),
  FLOW_NODE_NOT_OBJECT: (id: string) => createError({
    message: `The node with the ID "${id}" is not an object`,
    name: 'E_FLOW_NODE_NOT_OBJECT',
    context: { id },
  }),
  FLOW_NODE_SPECIFIER_NOT_STRING: (id: string) => createError({
    message: `The node specifier of the node with the ID "${id}" is not a string`,
    name: 'E_FLOW_NODE_SPECIFIER_NOT_STRING',
    context: { id },
  }),

  /***************************************************************************/
  /* Runtime errors.                                                         */
  /***************************************************************************/

  ISOLATED_VM_CATASTROPHIC_FAILURE: (message: string) => createError({
    message: `The JavaScript sandbox has encountered a catastrophic failure: ${message}`,
    name: 'E_RUNTIME_VM_CATASTROPHIC_FAILURE',
    context: { message },
  }),
  ISOLATED_VM_DISPOSED: () => createError({
    message: 'The JavaScript sandbox has been disposed',
    name: 'E_ISOLATED_VM_DISPOSED',
  }),

  /***************************************************************************/
  /* Reference errors.                                                       */
  /***************************************************************************/

  REFERENCE_NOT_RESOLVED: (ref: string) => createError({
    message: 'The reference could not be resolved',
    name: 'E_REFERENCE_NOT_RESOLVED',
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
  REFERENCE_TO_PENDING_NODE: (sourceId: string) => createError({
    message: `The reference to the "${sourceId}" node could not be resolved as this node is still pending. This is likely a circular dependency.`,
    name: 'E_REFERENCE_TO_PENDING_NODE',
    context: { sourceId },
  }),
  REFERENCE_TO_TOOL_BUT_NO_PROCESS_FUNCTION: (sourceId: string) => createError({
    message: `A tool reference to the node "${sourceId}" could not be resolved as the component does not have a process function`,
    name: 'E_REFERENCE_TO_TOOL_BUT_NO_PROCESS_FUNCTION',
    context: { sourceId },
  }),

  /***************************************************************************/
  /* Input errors.                                                           */
  /***************************************************************************/

  NODE_INPUT_SCHEMA_MISMATCH: (id: string, errors: Record<string, Error>) => createError({
    message: dedent(`
      The input schema of the node with the ID "${id}" does not match the input object:
      ${Object.entries(errors).map(([key, error]) => `  - ${key}: ${error.message}`).join('\n')}
    `),
    name: 'E_NODE_INPUT_SCHEMA_MISMATCH',
    context: { errors },
  }),
  INPUT_REQUIRED: (path: string) => createError({
    message: `The input at "${path}" is required but was not undefined`,
    name: 'E_INPUT_REQUIRED',
    context: { path },
  }),
  INPUT_NOT_ONE_OF: (path: string, errors: Error[]) => createError({
    message: [
      `The value at "${path}" did not match any of the oneOf schemas:`,
      errors.map(error => `  - ${error.message}`).join('\n'),
    ].join('\n'),
    name: 'E_NOT_ONE_OF',
    context: { errors, path },
  }),
  INPUT_NOT_IN_ENUM: (path: string, enumerations: unknown[]) => createError({
    message: dedent(`
      The input at "${path}" is expected to be one of the following values:
      ${enumerations.map(x => `  - ${String(x)}`).join('\n')}
    `),
    name: 'E_INPUT_NOT_STRING_ENUM',
    context: { path, enumerations },
  }),
  INPUT_NOT_CONST: (path: string, constant: unknown) => createError({
    message: `The input at "${path}" is expected to be the constant value "${String(constant)}"`,
    name: 'E_INPUT_NOT_CONST',
    context: { path, constant },
  }),

  // String errors.
  INPUT_NOT_STRING: (path: string) => createError({
    message: `The input at "${path}" is not a string`,
    name: 'E_INPUT_NOT_STRING',
    context: { path },
  }),
  INPUT_PATTERN_MISMATCH: (path: string, pattern: string) => createError({
    message: `The input at "${path}" does not match the pattern "${pattern}"`,
    name: 'E_INPUT_NOT_STRING_PATTERN',
    context: { path, pattern },
  }),
  INPUT_TOO_SHORT: (path: string, minLength: number) => createError({
    message: `The input at "${path}" is too short, expected at least ${minLength} characters`,
    name: 'E_INPUT_TOO_SHORT',
    context: { path, minLength },
  }),
  INPUT_TOO_LONG: (path: string, maxLength: number) => createError({
    message: `The input at "${path}" is too long, expected at most ${maxLength} characters`,
    name: 'E_INPUT_TOO_LONG',
    context: { path, maxLength },
  }),

  // Number errors.
  INPUT_NOT_NUMBER: (path: string) => createError({
    message: `The input at "${path}" is not a number`,
    name: 'E_INPUT_NOT_NUMBER',
    context: { path },
  }),
  INPUT_NUMBER_NOT_EXCEED_MINIMUM: (path: string, minimum: number) => createError({
    message: `The input number at "${path}" does not exceed the minimum value, expected at least ${minimum}`,
    name: 'E_INPUT_NUMBER_NOT_EXCEED_MINIMUM',
    context: { path, minimum },
  }),
  INPUT_NUNBER_NOT_BELOW_MAXIMUM: (path: string, maximum: number) => createError({
    message: `The input number at "${path}" does not fall below the maximum value, expected at most ${maximum}`,
    name: 'E_INPUT_NUMBER_NOT_BELOW_MAXIMUM',
    context: { path, maximum },
  }),
  INPUT_NUMBER_TOO_SMALL: (path: string, minimum: number) => createError({
    message: `The input number at "${path}" is too small, expected at least ${minimum}`,
    name: 'E_INPUT_NUMBER_TOO_SMALL',
    context: { path, minimum },
  }),
  INPUT_NUMBER_TOO_LARGE: (path: string, maximum: number) => createError({
    message: `The input number at "${path}" is too large, expected at most ${maximum}`,
    name: 'E_INPUT_NUMBER_TOO_LARGE',
    context: { path, maximum },
  }),
  INPUT_NUMBER_NOT_MULTIPLE_OF: (path: string, multipleOf: number) => createError({
    message: `The input number at "${path}" is not a multiple of ${multipleOf}`,
    name: 'E_INPUT_NUMBER_NOT_MULTIPLE_OF',
    context: { path, multipleOf },
  }),
  INPUT_NUMBER_NOT_INTEGER: (path: string) => createError({
    message: `The input at "${path}" is expected to be an integer value`,
    name: 'E_INPUT_NUMBER_NOT_INTEGER',
    context: { path },
  }),

  // Boolean errors.
  INPUT_NOT_BOOLEAN: (path: string) => createError({
    message: `The input at "${path}" is expected to be a boolean value`,
    name: 'E_INPUT_NOT_BOOLEAN',
  }),

  // Array errors.
  INPUT_NOT_ARRAY: (path: string) => createError({
    message: `The input at "${path}" is not an array`,
    name: 'E_INPUT_NOT_ARRAY',
    context: { path },
  }),
  INPUT_ARRAY_TOO_SHORT: (path: string, minItems: number) => createError({
    message: `The array at "${path}" is too short, expected at least ${minItems} items`,
    name: 'E_INPUT_ARRAY_TOO_SHORT',
    context: { path, minItems },
  }),
  INPUT_ARRAY_TOO_LONG: (path: string, maxItems: number) => createError({
    message: `The array at "${path}" is too long, expected at most ${maxItems} items`,
    name: 'E_INPUT_ARRAY_TOO_LONG',
    context: { path, maxItems },
  }),
  INPUT_ARRAY_NOT_UNIQUE: (path: string, extra: string[]) => createError({
    message: dedent(`
      The input array at "${path}" is not unique, the following items are duplicated:
      ${extra.map(x => `  - ${x}`).join('\n')}
    `),
    name: 'E_INPUT_ARRAY_NOT_UNIQUE',
    context: { path, extra },
  }),

  // Object errors.
  INPUT_NOT_OBJECT: (path: string) => createError({
    message: `The input at "${path}" is not an object`,
    name: 'E_INPUT_NOT_OBJECT',
    context: { path },
  }),
  INPUT_OBJECT_TOO_FEW_PROPERTIES: (path: string, minProperties: number) => createError({
    message: `The object at "${path}" has too few properties, expected at least ${minProperties}`,
    name: 'E_INPUT_OBJECT_TOO_FEW_PROPERTIES',
    context: { path, minProperties },
  }),
  INPUT_OBJECT_TOO_MANY_PROPERTIES: (path: string, maxProperties: number) => createError({
    message: `The object at "${path}" has too many properties, expected at most ${maxProperties}`,
    name: 'E_INPUT_OBJECT_TOO_MANY_PROPERTIES',
    context: { path, maxProperties },
  }),
  INPUT_OBJECT_EXTRA_PROPERTIES: (path: string, extra: string[]) => createError({
    message: dedent(`
      The object at "${path}" has extra properties:
      ${extra.map(x => `  - ${x}`).join('\n')}
    `),
    name: 'E_INPUT_OBJECT_EXTRA_PROPERTIES',
    context: { path, extra },
  }),
  INPUT_OBJECT_MISSING_PROPERTIES: (path: string, missing: string[]) => createError({
    message: dedent(`
      The object at "${path}" is missing required properties:
      ${missing.map(x => `  - ${x}`).join('\n')}
    `),
    name: 'E_INPUT_OBJECT_MISSING_PROPERTIES',
    context: { path, missing },
  }),

  // Stream errors.
  INPUT_NOT_STREAM: (path: string) => createError({
    message: `The input at "${path}" is not a stream`,
    name: 'E_INPUT_NOT_STREAM',
    context: { path },
  }),
  INPUT_STREAM_LOCKED: (path: string) => createError({
    message: `The input stream at "${path}" is locked`,
    name: 'E_INPUT_STREAM_LOCKED',
    context: { path },
  }),

  // File errors.
  INPUT_NOT_FILE: (path: string) => createError({
    message: `The input at "${path}" is not a file`,
    name: 'E_INPUT_NOT_FILE',
    context: { path },
  }),
}
