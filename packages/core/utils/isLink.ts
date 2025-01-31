import type { Reference } from './createReference'

/**
 * Predicate function to check if a value is a `Reference` object of a node.
 *
 * @param value The value to check.
 * @returns `true` if the value is a `Reference` object of a node, `false` otherwise.
 * @example isLink({ $ref: '#Node/NODE_ID/foo.bar' }) // true
 */
export function isLink(value: unknown): value is Reference {
  return typeof value === 'object'
    && value !== null
    && '$ref' in value
    && typeof value.$ref === 'string'
    && /^#Node\/\w+\/[\w.]+$/.test(value.$ref)
}
