/* eslint-disable @typescript-eslint/restrict-template-expressions */
import type { Thread, ThreadOptions } from './createThread'
import type { FlowV1 } from './serialize'
import { createThread } from './createThread'

/**
 * Instantiate a thread from a serialized JSON object.
 *
 * @param json The serialized JSON object.
 * @param options The options to create the thread with.
 * @returns The thread instance.
 */
export function createThreadFromJson(json: FlowV1, options: ThreadOptions = {}): Thread {
  const { version, components = {} } = json

  // --- Assert that the version is supported.
  if (!version) throw new Error('Flow file version is missing')
  if (version !== '1') throw new Error(`Unsupported flow file version: ${version}`)

  // --- Create the thread instance and add the component instances.
  // --- Collect all the instances to add to the thread.
  const thread = createThread(options)
  for (const id in components) {
    const { specifier, ...data } = components[id]
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
    thread.componentInstances.set(id, { specifier, input, metadata })
  }

  // --- Return the thread instance.
  return thread
}
