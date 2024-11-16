import type { ObjectLike } from '@unshared/types'

export interface ReferenceSecret {
  $fromSecret: {
    name: string
    defaultValue?: string
  }
}

export interface ReferenceVariable {
  $fromVariable: {
    name: string
    defaultValue?: string
  }
}

export interface ReferenceNode {
  $fromNode: {
    id: string
    name: string
    path?: string
  }
}

export interface ReferenceFile {
  $fromFile: {
    path: string
    defaultValue?: string
  }
}

export type Reference =
  | ReferenceFile
  | ReferenceNode
  | ReferenceSecret
  | ReferenceVariable

/**
 * Create a reference of a given type. The reference can be used to reference
 * values that are stored in remote locations or in other nodes and are only
 * available at runtime.
 *
 * @param kind The kind of the reference to create.
 * @param options The options to create the reference with.
 * @returns The reference created with the given options.
 * @example
 *
 * // Create a reference to a secret value.
 * const secretRef = createReference('fromSecret', {
 *   name: 'MY_SECRET',
 *   path: 'password',
 *   defaultValue: 'default-password',
 * })
 *
 * // Create a reference to a node value.
 * const nodeRef = createReference('fromNode', {
 *   id: 'node-id',
 *   key: 'output',
 *   path: 'value',
 * })
 */
export function createReference(kind: 'fromFile', options: ReferenceFile['$fromFile']): ReferenceFile
export function createReference(kind: 'fromNode', options: ReferenceNode['$fromNode']): ReferenceNode
export function createReference(kind: 'fromVariable', options: ReferenceVariable['$fromVariable']): ReferenceVariable
export function createReference(kind: 'fromSecret', options: ReferenceSecret['$fromSecret']): ReferenceSecret
export function createReference(kind: string, options: ObjectLike): Reference {
  return { [`$${kind}`]: options } as unknown as Reference
}

export function isReferenceLink(value: unknown): value is ReferenceNode {
  return typeof value === 'object' && value !== null && '$fromNode' in value
}

export function isReferenceSecret(value: unknown): value is ReferenceSecret {
  return typeof value === 'object' && value !== null && '$fromSecret' in value
}

export function isReferenceVariable(value: unknown): value is ReferenceVariable {
  return typeof value === 'object' && value !== null && '$fromVariable' in value
}

export function isReferenceFile(value: unknown): value is ReferenceFile {
  return typeof value === 'object' && value !== null && '$fromFile' in value
}

export function isReference(value: unknown): value is Reference {
  return isReferenceLink(value) || isReferenceSecret(value) || isReferenceVariable(value) || isReferenceFile(value)
}
