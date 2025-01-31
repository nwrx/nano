import type { Reference } from './createReference'
import { ERRORS as E } from './errors'
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
 * @example parseLink({ $ref: '#Node/NODE_ID/foo.bar' }) // { id: 'NODE_ID', path: 'foo.bar' }
 */
export function parseLink(value: Reference): LinkSourceObject {
  const [type, sourceId, sourceName, sourcePath] = parseReference(value)
  if (type !== 'Nodes') throw E.REFERENCE_WRONG_TYPE(type, 'Nodes')
  if (!sourceName) throw E.REFERENCE_MISSING_NAME(value.$ref)
  return { sourceId, sourceName, sourcePath }
}
