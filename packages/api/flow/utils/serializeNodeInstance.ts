import type { NodeInstance } from '@nwrx/core'
import type { DataSocketJSON } from './serializeDataSchema'
import type { ResultSocketJSON } from './serializeResultSchema'
import { serializeDataSchema } from './serializeDataSchema'
import { serializeResultSchema } from './serializeResultSchema'

/** The serialized representation of a flow node instance. */
export interface NodeInstanceJSON {
  id: string
  kind: string
  icon: string
  name: string
  label: string
  description: string
  position: { x: number; y: number }
  data: Record<string, unknown>
  result: Record<string, unknown>
  dataSchema: DataSocketJSON[]
  resultSchema: ResultSocketJSON[]
  isRunning: boolean
  isCollapsed: boolean
  isProcessing: boolean
  categoryName: string
  categoryColor: string
  errors?: string[]
}

/**
 * Given a `NodeInstance` object, returns a serialized version of it so
 * that it can be sent to the client without any circular references.
 *
 * @param instance The `NodeInstance` object to serialize.
 * @returns The serialized version of the `NodeInstance` object.
 */
export function serializeNodeInstance(instance: NodeInstance): NodeInstanceJSON {
  return {
    id: instance.id,
    kind: instance.node.kind,
    icon: instance.node.icon ?? '',
    name: instance.node.name ?? instance.node.kind,
    label: instance.meta.label ?? '',
    description: instance.node.description ?? '',
    position: instance.meta.position ?? { x: 0, y: 0 },
    data: instance.data,
    result: instance.result,
    dataSchema: serializeDataSchema(instance.dataSchema),
    resultSchema: serializeResultSchema(instance.resultSchema),
    isRunning: instance.isRunning,
    isCollapsed: instance.meta.isCollapsed ?? false,
    isProcessing: false, // instance.isProcessing,
    categoryName: instance.node.category?.name ?? 'Uncategorized',
    categoryColor: instance.node.category?.color ?? '#000000',
    errors: instance.errors.map(error => error.message),
  }
}
