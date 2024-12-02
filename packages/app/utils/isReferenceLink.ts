import type { ReferenceNode } from '@nwrx/core'

export function isReferenceLink(value: unknown): value is ReferenceNode {
  return typeof value === 'object' && value !== null && '$fromNode' in value
}
