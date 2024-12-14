import type { MaybeLiteral } from '@unshared/types'

export interface Reference {
  $ref: string
}

export type ReferenceType =
  | 'Flow'
  | 'Modules'
  | 'Node'
  | 'Secrets'

/**
 * Create a reference of a given type. The reference can be used to reference
 * values that are stored in remote locations or in other nodes and are only
 * available at runtime.
 *
 * @param kind The kind of the reference to create.
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
export function createReference(kind: MaybeLiteral<ReferenceType>, ...values: string[]): Reference {
  const value = [kind, ...values].join('/')
  return { $ref: `#${value}` }
}
