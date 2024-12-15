import type { Reference } from './createReference'

export function isReference(value: unknown): value is Reference {
  return typeof value === 'object'
    && value !== null
    && '$ref' in value
    && typeof value.$ref === 'string'
    && value.$ref.startsWith('#')
}
