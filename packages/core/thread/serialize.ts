import type { Thread } from './createThread'

export interface FlowV1ComponentInstance {
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
  metadata: FlowV1Metadata
  components: Record<string, FlowV1ComponentInstance>
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
  const components: Record<string, FlowV1ComponentInstance> = {}

  // --- Collect all component instances values and meta values.
  for (const [id, { specifier, input, metadata }] of thread.componentInstances) {

    // --- Prepend `_` to all meta properties.
    const metaProperties: Record<string, unknown> = {}
    for (const key in metadata) {
      const metaKey = `_${key}`
      const metaValue = metadata[key]
      metaProperties[metaKey] = metaValue
    }

    // --- Add the component instance to the components object.
    components[id] = { specifier, ...input, ...metaProperties }
  }

  return {
    version: '1',
    metadata,
    components,
  }
}
