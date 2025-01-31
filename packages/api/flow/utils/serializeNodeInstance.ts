import type { NodeInstance, NodeState } from '@nwrx/core'
import type { DataSocketJSON } from './serializeDataSchema'
import type { ResultSocketJSON } from './serializeResultSchema'
import { mapValues } from '@unshared/collection'
import { serializeDataSchema } from './serializeDataSchema'
import { serializeResultSchema } from './serializeResultSchema'

/** The serialized representation of a flow node instance. */
export interface NodeInstanceJSON {
  id: string
  error?: string
  state: NodeState

  // Definition
  kind: string
  icon: string
  name: string
  description: string
  categoryName: string
  categoryColor: string

  // User-specified metadata
  label: string
  comment: string
  position: { x: number; y: number }

  // Data
  data: Record<string, unknown>
  dataSchema: DataSocketJSON[]
  dataParseErrors: Record<string, string>

  // Result
  result: Record<string, unknown>
  resultSchema: ResultSocketJSON[]
  resultParseErrors: Record<string, string>
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
    error: instance.error?.message,
    state: instance.state,
    kind: instance.node.kind,
    icon: instance.node.icon ?? '',
    name: instance.node.name ?? instance.node.kind,
    description: instance.node.description ?? '',
    categoryName: instance.node.category?.name ?? 'Uncategorized',
    categoryColor: instance.node.category?.color ?? '#000000',
    label: instance.meta.label ?? '',
    comment: instance.meta.comment ?? '',
    position: instance.meta.position ?? { x: 0, y: 0 },
    data: instance.data,
    dataSchema: serializeDataSchema(instance.dataSchema),
    dataParseErrors: mapValues(instance.dataParseErrors, error => error.message),
    result: instance.result,
    resultSchema: serializeResultSchema(instance.resultSchema),
    resultParseErrors: mapValues(instance.resultParseErrors, error => error.message),
  }
}
