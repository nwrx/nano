import type { Flow } from './createFlow'
import type { FlowExportV1, FlowNodeExportV1 } from './flowFromJsonV1'

const MODULE_KIND_EXP = /^([^/]+)\/(.+)$/

/**
 * The JSON representation of a flow definition. The JSON representation can be
 * used to serialize the flow to a string or to store the flow in the database.
 */
export type FlowExport = FlowExportV1

/**
 * Serialize the `Flow` instance to a JSON object that can be saved to the server
 * or sent over the network. This function is used by the flow editor to save the
 * flow to the server and store it in the database.
 *
 * @param flow The flow object to serialize.
 * @returns The serialized flow object.
 */
export function flowToJson(flow: Flow): FlowExport {
  const nodes: Record<string, FlowNodeExportV1> = {}
  const modules = new Set<string>()

  // --- Serialize the flow nodes.
  for (const node of flow.nodes) {

    // --- Extract the module and kind.
    const match = MODULE_KIND_EXP.exec(node.node.kind)
    if (!match) throw new Error(`Invalid node kind: ${node.node.kind}`)
    const [, nodeModule, nodeKind] = match
    modules.add(nodeModule)
    const kind = `${nodeModule}/${nodeKind}`

    // --- Extract node meta.
    const meta: Record<string, unknown> = {}
    for (const key in node.meta) {
      const metaKey = `_${key}`
      const metaValue = node.meta[key]
      meta[metaKey] = metaValue
    }

    // --- Export the node.
    nodes[node.id] = { kind, ...meta, ...node.data }
  }

  return {
    version: '1',
    name: flow.meta.name,
    icon: flow.meta.icon,
    description: flow.meta.description,
    modules: [...modules],
    nodes,
  }
}
