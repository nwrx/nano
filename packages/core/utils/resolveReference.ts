import type { ReferenceResolver } from '../thread'
import type { Reference } from './createReference'

/**
 * The function that is used to resolve a reference to a value. The resolve
 * function is used to resolve the reference to a value that can be used in the
 * flow.
 *
 * @param reference The reference to resolve.
 * @param resolvers The resolvers that are used to resolve the reference.
 * @returns The resolved value.
 */
export async function resolveReference(reference: unknown, resolvers: ReferenceResolver[]): Promise<unknown> {
  for (const resolve of resolvers) {
    const value = await resolve(reference as Reference)
    if (value) return value
  }
  throw new Error(`The reference "${JSON.stringify(reference)}" could not be resolved.`)
}
