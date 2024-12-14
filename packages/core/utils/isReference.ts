import type { Reference } from './createReference'

/**
 * Predicate if the given value is a `Reference`. This function will check
 * if the value is an object and has a `$ref` property.
 *
 * @param value The value to check if it is a `Reference`.
 * @returns `true` if the value is a `Reference`, otherwise `false`.
 */
export function isReference(value: unknown): value is Reference {
  return typeof value === 'object'
    && value !== null
    && '$ref' in value
    && typeof value.$ref === 'string'
    && value.$ref.startsWith('#')
}
