import type { Module } from './defineModule'
import { Flow } from './createFlow'
import { FLOW_FILE_VERSION } from './flowToJson'

export interface FlowNodeExportV1 {
  kind: string
  [key: string]: unknown
}

export interface FlowExportV1 {
  version?: string
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
 * @param modules The modules that are available to the flow.
 * @returns The new flow instance.
 */
export function flowFromJsonV1<T extends Module = Module>(json: FlowExportV1, modules: T[] = []): Flow<T> {
  const { version, nodes = {}, ...meta } = json

  // --- Assert that the version is supported.
  if (!version) throw new Error('Flow file version is missing')
  // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
  if (version !== FLOW_FILE_VERSION.V1) throw new Error(`Unsupported flow file version: ${version}`)

  // --- Collect the modules that are used in the flow.
  const nodesEntries = Object.entries(nodes)
  for (const [, node] of nodesEntries) {
    if (!node.kind) throw new Error('Node kind is missing')
    const [moduleName] = node.kind.split(':')
    const module = modules.find(module => module.kind === moduleName)
    if (!module) throw new Error(`Module "${moduleName}" was not found in the globally registered modules`)
  }

  // --- Create the flow instance with the settings and nodes.
  const flow = new Flow<T>({ meta, modules })

  // --- Collect all the instances to add to the flow.
  for (const [id, node] of nodesEntries) {
    const { kind, ...data } = node
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
    flow.createNode(kind, { id, meta, initialData })
  }

  // --- Return the flow instance.
  return flow
}
