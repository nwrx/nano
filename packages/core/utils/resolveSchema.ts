import type { ObjectLike } from '@unshared/types'
import type { InputSchema, InputSocket, OutputSchema, OutputSocket } from '../module'
import type { ResolveReference } from './types'
import { isReference } from './createReference'
import { ERRORS } from './errors'

/**
 * Resolve the input value by checking if the value is a reference or a value.
 * If the value is a reference, the reference is resolved by calling the resolve
 * function that is passed in the options. If the value is a value, the value is
 * returned as is while making sure it matches the type of the socket.
 *
 * @param value The value to resolve.
 * @param socket The socket to match the value with.
 * @param resolvers The list of resolvers to resolve the reference with.
 * @returns The resolved value.
 * @example
 *
 * // Resolve a raw value.
 * const value = resolveSchemaValue('Hello, World!', { type: string }, []) // 'Hello, World!'
 *
 * // Resolve a reference value with a resolver.
 * const value = resolveSchemaValue({ $fromNode: { id: 'node-id', key: 'output' }, ...), { resolveReference }) // 'Hello, World!'
 */
async function resolveSchemaValue(value: unknown, socket: InputSocket | OutputSocket, resolvers: ResolveReference[] = []): Promise<unknown> {

  // --- If the value is a reference to a value, resolve the reference by calling the
  // --- resolveReference function that is passed in the options.
  if (isReference(value)) {
    for (const resolve of resolvers) {
      const resolved = await resolve(value)
      if (resolved) return resolved
    }
  }

  // --- Otherwise, return the value as is. Making sure it matches the type of the socket.
  if (value === undefined && socket.isOptional) return
  if (value === undefined && !socket.isOptional) throw ERRORS.NODE_SCHEMA_VALUE_MISSING(socket)
  return socket.type.parse(value)
}

/**
 * Resolve the input object by iterating over the input schema and resolving the
 * input values. If the value is an array, each value in the array is resolved.
 *
 * @param values The input object to resolve.
 * @param schema The input schema to resolve the values with.
 * @param resolvers The list of resolvers to resolve the reference with.
 * @returns The resolved input object.
 * @example
 *
 * // Resolve an input object.
 * const input = resolveSchema({ name: 'John Doe' }, { name: { type: string } }, []) // { name: 'John Doe' }
 */
export async function resolveSchema(values: ObjectLike, schema: InputSchema | OutputSchema, resolvers: ResolveReference[] = []): Promise<ObjectLike> {
  const resolved: ObjectLike = {}

  // --- Iterate over the input schema and resolve the input values.
  for (const key in schema) {
    const value = values[key]
    const socket = schema[key]

    // --- If the value is an array, resolve each value in the array.
    if (socket.isIterable) {
      if (!Array.isArray(value)) throw ERRORS.NODE_SCHEMA_NOT_ITERABLE(socket)
      const promises = value.map(x => resolveSchemaValue(x, socket, resolvers))
      resolved[key] = await Promise.all(promises)
    }

    // --- Otherwise, resolve the value as is.
    else {
      resolved[key] = await resolveSchemaValue(value, socket, resolvers)
    }
  }

  // --- Return the resolved input so far.
  return resolved
}
