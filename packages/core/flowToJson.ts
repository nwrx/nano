import type { Flow } from './createFlow'
import type { FlowModule } from './defineFlowModule'
import type { FlowExportV1, FlowNodeExportV1 } from './flowFromJsonV1'

/**
 * An enumeration of flow file versions. This is used to determine how to
 * parse the flow and what features are available in the flow file. This
 * allows for backwards compatibility with older flow files from previous
 * versions of the application.
 */
export enum FLOW_FILE_VERSION {
  V1 = '1',
}

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
export function flowToJson(flow: Flow<FlowModule<string, any, any>>): FlowExport {
  const nodes: Record<string, FlowNodeExportV1> = {}
  const modules = new Set<string>()

  // --- Serialize the flow nodes.
  for (const node of flow.nodes) {
    const nodeModule = flow.resolveNodeModule(node)
    const nodeKind = `${nodeModule.kind}:${node.node.kind}`
    const nodeData: FlowNodeExportV1 = { kind: nodeKind }
    modules.add(nodeModule.kind)

    // --- Collect the node data and the links.
    for (const key in node.dataSchema) {
      const linkTarget = `${node.id}:${key}`
      const linkFrom = flow.links.find(link => link.target === linkTarget)
      if (linkFrom) nodeData[key] = `$NODE.${linkFrom.source}`
      if (node.dataRaw[key] !== undefined) nodeData[key] = String(node.dataRaw[key])
    }

    // --- Collect the node meta data.
    for (const key in node.meta) {
      const metaKey = `_${key}`
      const metaValue = node.meta[key]
      nodeData[metaKey] = metaValue
    }

    // --- Export the node.
    nodes[node.id] = nodeData
  }

  return {
    version: FLOW_FILE_VERSION.V1,
    name: flow.meta.name,
    icon: flow.meta.icon,
    description: flow.meta.description,
    modules: [...modules],
    nodes,
  }
}
