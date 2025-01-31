import type { FlowNode } from '@nwrx/core'
import type { FlowNodePortJSON } from './serializeFlowSchema'
import { serializeFlowSchema } from './serializeFlowSchema'

/** The serialized representation of a flow node. */
export interface FlowNodeJSON {
  kind: string
  name?: string
  icon?: string
  categoryKind?: string
  categoryName?: string
  categoryIcon?: string
  categoryColor?: string
  categoryDescription?: string
  description?: string
  dataSchema?: FlowNodePortJSON[]
  resultSchema?: FlowNodePortJSON[]
}

/**
 * Given a flow node, return a serialized version of it. This is used to send
 * the flow node to the client without any circular references.
 *
 * @param node The flow node to serialize.
 * @returns The serialized version of the flow node.
 */
export function serializeFlowNode(node: FlowNode): FlowNodeJSON {
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
    dataSchema: serializeFlowSchema(node.defineDataSchema),
    resultSchema: serializeFlowSchema(node.defineResultSchema),
  }
}
