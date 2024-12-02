import type { FlowV1, FlowV1ComponentInstance } from '../utils'
import type { Thread } from './createThread'

export function serializeThread(thread: Thread): FlowV1 {
  const components: Record<string, FlowV1ComponentInstance> = {}

  // --- Collect all component instances values and meta values.
  for (const [id, { kind, input, meta }] of thread.componentInstances) {

    // --- Prepend `_` to all meta properties.
    const metaProperties: Record<string, unknown> = {}
    for (const key in meta) {
      const metaKey = `_${key}`
      const metaValue = meta[key]
      metaProperties[metaKey] = metaValue
    }

    // --- Add the component instance to the components object.
    components[id] = { kind, ...input, ...metaProperties }
  }

  return {
    version: '1',
    components,
  }
}
