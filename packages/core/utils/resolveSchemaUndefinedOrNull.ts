import type { SocketSchema } from './defineComponent'
import { ERRORS as E } from './errors'

export function resolveSchemaUndefinedOrNull(path: string, schema: SocketSchema): unknown {

  // --- Returns the default value if the value is undefined or null and optional,
  // --- Note that this is only available in trusted components since it can be used
  // --- to remotely execute code.
  if ('x-default' in schema && typeof schema['x-default'] === 'function') {
    return schema['x-default']()
  }

  // --- To avoid potential security issues in trusted components, if the default value
  // --- is an object or array, deeply clone it and freeze it to prevent modifications.
  else if ('default' in schema && typeof schema.default === 'object' && schema.default !== null) {
    const clone = structuredClone(schema.default) as Record<string, unknown>
    return Object.freeze(clone)
  }

  // --- Otherwise, return the default value as is.
  else if ('default' in schema) {
    return schema.default
  }

  // --- If the value is optional, return undefined.
  else if ('x-optional' in schema && schema['x-optional'] === true) {
    return undefined
  }

  // --- Otherwise, throw an error because the value is required.
  throw E.INPUT_REQUIRED(path)
}
