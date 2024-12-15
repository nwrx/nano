import type { ObjectLike } from '@unshared/types'
import type { InputSocket, OutputSocket } from './defineComponent'
import type { ReferenceResolver } from './resolveReference'
import { createError } from './createError'
import { resolveSchemaValue } from './resolveSchemaValue'

export interface ResolveSchemaOptions {
  data?: ObjectLike
  schema?: Record<string, InputSocket | OutputSocket>
  resolvers?: ReferenceResolver[]
  skipErrors?: boolean
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
  const { data = {}, schema = {}, resolvers = [], skipErrors = false } = options
  const resolved: ObjectLike = {}
  const errors: Record<string, Error> = {}

  // --- Iterate over the input schema and resolve the input values.
  for (const key in schema) {
    const value = data[key]
    try { resolved[key] = await resolveSchemaValue(value, schema[key], resolvers) }
    catch (error) {
      errors[key] = error as Error
      if (skipErrors) continue
    }
  }

  // --- If there are any errors, throw an error with the list of errors.
  if (!skipErrors && Object.keys(errors).length > 0) {
    throw createError({
      name: 'SCHEMA_RESOLVE_ERROR',
      message: 'Failed to resolve the schema.',
      context: errors,
    })
  }

  // --- Return the resolved input so far.
  return resolved
}
