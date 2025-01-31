import type { MaybeLiteral } from '@unshared/types'

export interface Reference {
  $ref: string
}

export type ReferenceType =
  | 'Nodes'
  | 'Secrets'
  | 'Tools'
  | 'Variables'

/**
 * Create a reference of a given type. The reference can be used to reference
 * values that are stored in remote locations or in other nodes and are only
 * available at runtime.
 *
 * @param type The type of reference to create.
 * @param values The values to use to create the reference.
 * @returns The reference created with the given options.
 * @example
 *
 * // Create a reference to a secret value.
 * const secretRef = createReference('Secrets', 'SECRET_NAME') // { $ref: '#Secrets/SECRET_NAME' }
 *
 * // Create a reference to a node value.
 * const nodeRef = createReference('Node', 'NODE_ID') // { $ref: '#Node/NODE_ID' }
 */
export function createReference(type: MaybeLiteral<ReferenceType>, ...values: string[]): Reference {
  return { $ref: ['#', type, ...values].join('/') }
}
