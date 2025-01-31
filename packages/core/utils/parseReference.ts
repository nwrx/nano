import type { Reference, ReferenceType } from './createReference'
import { ERRORS as E } from './errors'

/**
 * Parse a `Reference` object and extract the reference type and value.
 *
 * @param value The reference object to parse.
 * @returns The reference type and value extracted from the reference.
 * @example parseReference({ $ref: '#/Nodes/Foo/Bar' }) // ['Nodes', 'Foo', 'Bar']
 */
export function parseReference(value: Reference): [ReferenceType, ...string[]] {
  const parts = value.$ref.split('/')
  if (parts.length < 3) throw E.REFERENCE_INVALID_FORMAT()
  if (parts[0] !== '#') throw E.REFERENCE_INVALID_TAG()
  if (parts[1].trim() === '') throw E.REFERENCE_INVALID_TYPE()
  if (parts[2].trim() === '') throw E.REFERENCE_INVALID_VALUE()
  return parts.slice(1) as [ReferenceType, ...string[]]
}
