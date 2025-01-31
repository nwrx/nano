import type { Reference, ReferenceType } from './createReference'

/**
 * Parse a `Reference` object and extract the reference type and value.
 *
 * @param value The reference object to parse.
 * @returns The reference type and value extracted from the reference.
 * @example parseReference({ $ref: '#/Nodes/Foo/Bar' }) // ['Nodes', 'Foo', 'Bar']
 */
export function parseReference(value: Reference): [ReferenceType, ...string[]] {
  const parts = value.$ref.split('/')
  if (parts.length < 3) throw new Error('Invalid reference format')
  if (parts[0] !== '#') throw new Error('Invalid reference tag')
  if (parts[1].trim() === '') throw new Error('Invalid reference type')
  if (parts[2].trim() === '') throw new Error('Invalid reference value')
  return parts.slice(1) as [ReferenceType, ...string[]]
}
