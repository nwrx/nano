import type { FlowNodeInstance } from '@nwrx/core'
import type { FlowNodePortJSON } from './serializeFlowSchema'
import { serializeFlowSchema } from './serializeFlowSchema'

/** The serialized representation of a flow node instance. */
export interface FlowNodeInstanceJSON {
  id: string
  kind: string
  icon: string
  name: string
  label: string
  description: string
  position: { x: number; y: number }
  data: Record<string, unknown>
  result: Record<string, unknown>
  dataSchema: FlowNodePortJSON[]
  resultSchema: FlowNodePortJSON[]
  isRunning: boolean
  isCollapsed: boolean
  isProcessing: boolean
  categoryName: string
  categoryColor: string
  error?: string
}

/**
 * Given a `FlowNodeInstance` object, returns a serialized version of it so
 * that it can be sent to the client without any circular references.
 *
 * @param instance The `FlowNodeInstance` object to serialize.
 * @returns The serialized version of the `FlowNodeInstance` object.
 */
export function serializeFlowNodeInstance(instance: FlowNodeInstance): FlowNodeInstanceJSON {
  const nodeModule = instance.flow.resolveNodeModule(instance)
  return {
    id: instance.id,
    kind: `${nodeModule.kind}:${instance.node.kind}`,
    icon: instance.node.icon ?? '',
    name: instance.node.name ?? `${nodeModule.kind}:${instance.node.kind}`,
    label: instance.meta.label ?? '',
    description: instance.node.description ?? '',
    position: instance.meta.position ?? { x: 0, y: 0 },
    data: instance.dataRaw,
    result: instance.result,
    dataSchema: serializeFlowSchema(instance.dataSchema),
    resultSchema: serializeFlowSchema(instance.resultSchema),
    isRunning: instance.isRunning,
    isCollapsed: instance.meta.isCollapsed ?? false,
    isProcessing: false, // instance.isProcessing,
    categoryName: instance.node.category?.name ?? 'Uncategorized',
    categoryColor: instance.node.category?.color ?? '#000000',
    error: instance.error?.message,
  }
}
