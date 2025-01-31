import type { Thread, ThreadOptions } from './createThread'
import type { FlowV1 } from './serialize'
import { ERRORS as E } from '../utils'
import { addNode } from './addNode'
import { createThread } from './createThread'

/**
 * Instantiate a thread from a serialized JSON object.
 *
 * @param flow The serialized JSON object.
 * @param options The options to create the thread with.
 * @returns The thread instance.
 */
export function createThreadFromFlow(flow: FlowV1, options: ThreadOptions = {}): Thread {
  const { version, nodes = {} } = flow

  // --- Assert that the version is supported.
  if (!version) throw E.FLOW_VERSION_MISSING()
  if (version !== '1') throw E.FLOW_VERSION_UNSUPPORTED(version)

  // --- Add all the nodes to the thread.
  const thread = createThread(options)
  for (const id in nodes) {
    const node = nodes[id]
    if (typeof node !== 'object' || !node.component) throw E.FLOW_NODE_NOT_OBJECT(id)
    if (typeof node.component !== 'string') throw E.FLOW_NODE_SPECIFIER_NOT_STRING(id)

    const { component: specifier, ...data } = nodes[id]
    const metadata: Record<string, unknown> = {}
    const input: Record<string, unknown> = {}

    // --- Collect the static data and the links.
    // --- If the key starts with an underscore, store it as metadata data.
    // --- Otherwise, store the value as initial data.
    for (const key in data) {
      const value = data[key]
      if (key.startsWith('_')) metadata[key.slice(1)] = value
      else input[key] = value
    }

    // --- Append the component instance to the thread.
    addNode(thread, specifier, { id, input, metadata })
  }

  // --- Return the thread instance.
  return thread
}
