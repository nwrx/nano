import type { MaybePromise } from '@unshared/types'
import type { Reference, ReferenceType } from './createReference'
import { parseReference } from './parseReference'

/**
 * The function that is used to resolve a reference to a value. The resolve
 * function is used to resolve the reference to a value that can be used in
 * the flow.
 */
export type ReferenceResolver = (type: ReferenceType, ...values: string[]) => MaybePromise<unknown>

/**
 * The function that is used to resolve a reference to a value. The resolve
 * function is used to resolve the reference to a value that can be used in the
 * flow.
 *
 * @param reference The reference to resolve.
 * @param resolvers The resolvers that are used to resolve the reference.
 * @returns The resolved value.
 */
export async function resolveReference(reference: Reference, resolvers: ReferenceResolver[]): Promise<unknown> {
  const [type, ...values] = parseReference(reference)
  for (const resolve of resolvers) {
    const value = await resolve(type, ...values)
    if (value !== undefined) return value
  }
}
