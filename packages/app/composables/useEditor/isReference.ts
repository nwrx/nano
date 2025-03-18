import type { Reference } from '@nwrx/nano/utils'

export function isReference(value: unknown): value is Reference {
  if (typeof value !== 'object') return false
  if ( value === null) return false
  if ('$ref' in value === false) return false
  if (typeof value.$ref !== 'string') return false
  return value.$ref.startsWith('#/')
}
