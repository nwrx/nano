import type { MaybeLiteral } from '@unshared/types'
import type { FlowOptions } from './createFlow'
import { Flow } from './createFlow'

export interface FlowNodeExportV1 {
  kind: string
  [key: string]: unknown
}

export interface FlowExportV1 {
  version: MaybeLiteral<'1'>
  name?: string
  icon?: string
  description?: string
  modules?: string[]
  nodes?: Record<string, FlowNodeExportV1>
  [key: string]: unknown
}

/**
 * Given a `FlowExport` object, instantiate a new `Flow` instance with the
 * same settings and nodes. This function is used to load a flow from a
 * serialized object and restore the flow to its previous state.
 *
 * @param json The flow export object to instantiate the flow with.
 * @param options The options to create the flow with.
 * @returns The new flow instance.
 */
export async function flowFromJsonV1(json: FlowExportV1, options: FlowOptions = {}): Promise<Flow> {
  const { version, nodes = {}, ...meta } = json

  // --- Assert that the version is supported.
  if (!version) throw new Error('Flow file version is missing')
  if (version !== '1') throw new Error(`Unsupported flow file version: ${version}`)

  // --- Create the flow instance with the settings and nodes.
  // --- Collect all the instances to add to the flow.
  const flow = new Flow({ meta, ...options })
  for (const id in nodes) {
    const { kind, ...data } = nodes[id]
    const meta: Record<string, unknown> = {}
    const initialData: Record<string, unknown> = {}

    // --- Collect the static data and the links.
    // --- If the key starts with an underscore, store it as meta data.
    // --- Otherwise, store the value as initial data.
    for (const key in data) {
      const value = data[key]
      if (key.startsWith('_')) meta[key.slice(1)] = value
      else initialData[key] = value
    }

    // --- Create the node instance.
    try {
      await flow.add(kind, { id, meta, initialData })
    }
    catch (error) {
      const message = (error as Error).message
      console.error(`Failed to create node instance ${id} of kind ${kind}: ${message}`)
    }
  }

  // --- Return the flow instance.
  return flow
}
