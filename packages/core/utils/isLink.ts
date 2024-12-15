import type { Reference } from './createReference'
import { isReference } from './isReference'
import { parseReference } from './parseReference'

export function isLink(value: unknown): value is Reference {
  if (!isReference(value)) return false
  const [type] = parseReference(value)
  return type === 'Nodes'
}
