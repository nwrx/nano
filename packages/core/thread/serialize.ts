import type { Thread } from './createThread'
import { serializeSpecifier } from '../utils'

export interface FlowV1Node {
  specifier: string
  [key: string]: unknown
}

export interface FlowV1Metadata {
  name?: string
  icon?: string
  description?: string
  createdAt?: string
  updatedAt?: string
  createdBy?: string
}

export interface FlowV1 {
  version: '1'
  nodes: Record<string, FlowV1Node>
  metadata?: FlowV1Metadata
}

/**
 * Serialize a thread to a JSON object. This allows the thread to be saved
 * to a file or sent over the network and later restored using the `createThreadFromJson` function.
 *
 * @param thread The thread to serialize.
 * @param metadata The metadata to include in the serialized JSON object.
 * @returns The serialized JSON object.
 * @example serializeThread(thread) // { version: '1', components: { ... } }
 */
export function serialize(thread: Thread, metadata: FlowV1Metadata = {}): FlowV1 {
  const nodes: Record<string, FlowV1Node> = {}

  // --- Collect all component instances values and meta values.
  for (const [id, node] of thread.nodes) {

    // --- Prepend `_` to all meta properties.
    const metaProperties: Record<string, unknown> = {}
    for (const key in node.metadata) {
      const metaKey = `_${key}`
      const metaValue = node.metadata[key]
      metaProperties[metaKey] = metaValue
    }

    // --- Add the component instance to the components object.
    nodes[id] = {
      specifier: serializeSpecifier(node),
      ...node.input,
      ...metaProperties,
    }
  }

  return {
    version: '1',
    metadata,
    nodes,
  }
}
