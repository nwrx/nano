import type { ReferenceNode } from '@nwrx/nano'

export function isReferenceLink(value: unknown): value is ReferenceNode {
  return typeof value === 'object' && value !== null && '$fromNode' in value
}
