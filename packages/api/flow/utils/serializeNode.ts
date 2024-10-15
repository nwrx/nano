import type { Node } from '@nwrx/core'
import type { DataSocketJSON } from './serializeDataSchema'
import type { ResultSocketJSON } from './serializeResultSchema'
import { serializeDataSchema } from './serializeDataSchema'
import { serializeResultSchema } from './serializeResultSchema'

/** The serialized representation of a flow node. */
export interface NodeJSON {
  kind: string
  name?: string
  icon?: string
  categoryKind?: string
  categoryName?: string
  categoryIcon?: string
  categoryColor?: string
  categoryDescription?: string
  description?: string
  dataSchema?: DataSocketJSON[]
  resultSchema?: ResultSocketJSON[]
}

/**
 * Given a flow node, return a serialized version of it. This is used to send
 * the flow node to the client without any circular references.
 *
 * @param node The flow node to serialize.
 * @returns The serialized version of the flow node.
 */
export function serializeNode(node: Node): NodeJSON {
  return {
    kind: node.kind,
    icon: node.icon,
    name: node.name,
    description: node.description,
    categoryKind: node.category?.kind,
    categoryName: node.category?.name,
    categoryIcon: node.category?.icon,
    categoryColor: node.category?.color ?? '#000000',
    categoryDescription: node.category?.description,
    dataSchema: serializeDataSchema(node.dataSchema),
    resultSchema: serializeResultSchema(node.resultSchema),
  }
}
