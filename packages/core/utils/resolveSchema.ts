/* eslint-disable sonarjs/cognitive-complexity */
import type { ObjectLike } from '@unshared/types'
import type { InputSchema, InputSocket, OutputSchema, OutputSocket } from '../module'
import type { ResolveReference } from './types'
import { assertArray, ValidationError } from '@unshared/validation'
import { FlowError } from './createError'
import { isReference } from './createReference'
import { ERRORS } from './errors'

export interface ResolveSchemaOptions {
  values?: ObjectLike
  schema?: InputSchema | OutputSchema
  resolvers?: ResolveReference[]
  skipErrors?: boolean
}

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
      if (resolved === undefined) continue
      value = resolved
      break
    }
  }

  // --- Otherwise, return the value as is. Making sure it matches the type of the socket.
  if (value === undefined && socket.isOptional) return 'defaultValue' in socket ? socket.defaultValue : undefined
  if (value === undefined && !socket.isOptional) throw ERRORS.NODE_SCHEMA_VALUE_MISSING(socket)
  return socket.type.parse(value)
}

/**
 * Resolve the input object by iterating over the input schema and resolving the
 * input values. If the value is an array, each value in the array is resolved.
 *
 * @param options The options to resolve the input object.
 * @returns The resolved input object.
 * @example
 *
 * // Resolve an input object.
 * const input = resolveSchema({ name: 'John Doe' }, { name: { type: string } }, []) // { name: 'John Doe' }
 */
export async function resolveSchema(options: ResolveSchemaOptions): Promise<ObjectLike> {
  const { values = {}, schema = {}, resolvers = [], skipErrors = false } = options
  const resolved: ObjectLike = {}

  // --- Iterate over the input schema and resolve the input values.
  for (const key in schema) {
    const value = values[key]
    const socket = schema[key]

    // --- If the value is an array, resolve each value in the array.
    // --- Otherwise, parse the value as-is and return the resolved value.
    try {
      if (socket.isIterable) {
        if (socket.isOptional && value === undefined) {
          resolved[key] = []
          continue
        }
        assertArray(value)
        const promises = value.map(x => resolveSchemaValue(x, socket, resolvers))
        resolved[key] = await Promise.all(promises)
      }
      else {
        resolved[key] = await resolveSchemaValue(value, socket, resolvers)
      }
    }
    catch (error) {
      if (skipErrors) continue
      if (error instanceof ValidationError) {
        const errors = error.context as Record<string, Error | ValidationError>
        for (const key in errors) {
          if (errors[key] instanceof ValidationError) {
            if (errors[key].name === 'E_RULE_SET_MISMATCH') {
              throw new FlowError({
                message: `Could not resolve the value of "${socket.name}/${key}": ${errors[key].message}`,
                name: errors[key].name,
              })
            }
            throw new FlowError({
              message: `Could not resolve the value of "${socket.name}/${key}": ${errors[key].message}`,
              name: errors[key].name,
            })
          }
        }
        throw new FlowError({
          message: `Could not resolve the value of "${socket.name}": ${error.message}`,
          name: error.name,
        })
      }
      else if (error instanceof FlowError) {
        throw new FlowError({
          message: `Failed to resolve the value of "${socket.name}": ${error.message}`,
          name: error.name,
          data: { key, value, socket, ...error.data },
        })
      }
      throw error
    }
  }

  // --- Return the resolved input so far.
  return resolved
}
