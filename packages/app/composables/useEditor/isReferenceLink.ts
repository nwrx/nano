import type { Reference } from '@nwrx/nano/utils'
import { isReference } from './isReference'

/**
 * Check if the value is a `Reference` and the reference is a link to a node.
 *
 * @param value The value to check
 * @returns `true` if the value is a reference is a link to a node, otherwise `false`.
 * @example isReferenceLink({ $ref: '#/Nodes/1' }) // true
 */
export function isReferenceLink(value: unknown): value is Reference {
  return isReference(value)
    && value.$ref.startsWith('#/Nodes/')
}
