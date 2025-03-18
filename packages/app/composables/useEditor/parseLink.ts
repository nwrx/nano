import type { Reference } from '@nwrx/nano/utils'
import { parseReference } from './parseReference'

export interface LinkSourceObject {
  sourceId: string
  sourceName: string
  sourcePath?: string
}

export function parseLink(value: Reference): LinkSourceObject | undefined {
  const parsedReference = parseReference(value)
  if (!parsedReference) return undefined
  const [type, sourceId, sourceName, sourcePath] =parsedReference
  if (type !== 'Nodes') return undefined
  return { sourceId, sourceName, sourcePath }
}
