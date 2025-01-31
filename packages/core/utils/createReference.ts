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
export function createReference(type: ReferenceType, ...values: Array<string| undefined>): Reference {
  if (values.length === 0) throw new Error('At least one value is required to create a reference')
  return { $ref: ['#', type, ...values].filter(Boolean).join('/') }
}
