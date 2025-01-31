import type { Reference } from './createReference'
import { parseReference } from './parseReference'

export interface LinkSourceObject {
  sourceId: string
  sourceName: string
  sourcePath?: string
}

/**
 * Parse a `Reference` object and extract the source node ID and path.
 *
 * @param value The reference object to parse.
 * @returns The source node ID and path extracted from the reference.
 * @example parseReferenceLink({ $ref: '#Node/NODE_ID/foo.bar' }) // { id: 'NODE_ID', path: 'foo.bar' }
 */
export function parseReferenceLink(value: Reference): LinkSourceObject {
  const [type, sourceId, sourceName, sourcePath] = parseReference(value)
  if (type !== 'Nodes') throw new Error(`Invalid reference type: ${type}`)
  if (!sourceId) throw new Error('The reference does not contain a node ID')
  if (!sourceName) throw new Error('The reference does not contain a name')
  return { sourceId, sourceName, sourcePath }
}
