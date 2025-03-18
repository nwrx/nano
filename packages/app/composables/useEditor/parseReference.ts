import type { Reference, ReferenceType } from '@nwrx/nano/utils'

export function parseReference(value?: Reference): [ReferenceType, ...string[]] | undefined {
  if (!value) return undefined
  const parts = value.$ref.split('/')
  if (parts.length < 3) return undefined
  if (parts[0] !== '#') return undefined
  if (parts[1].trim() === '') return undefined
  if (parts[2].trim() === '') return undefined
  return parts.slice(1) as [ReferenceType, ...string[]]
}
