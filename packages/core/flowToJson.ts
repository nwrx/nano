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

/* v8 ignore start */
if (import.meta.vitest) {
  const { createFlow } = await import('./createFlow')
  const { moduleCore } = await import('./__fixtures__')

  describe('toJSON', () => {
    it('should export the name, icon, and description of the flow', () => {
      const flow = createFlow({ meta: { name: 'Flow', icon: 'flow', description: 'A flow' } })
      const json = flowToJson(flow)
      expect(json).toStrictEqual({
        version: '1',
        name: 'Flow',
        icon: 'flow',
        description: 'A flow',
        modules: [],
        nodes: {},
      })
    })

    it('should export the flow and store the nodes and modules', async() => {
      const flow = createFlow({ modules: [moduleCore] })
      const node1 = await flow.nodeCreate('nwrx/core:json-parse')
      const json = flowToJson(flow)
      expect(json).toStrictEqual({
        version: '1',
        name: undefined,
        icon: undefined,
        description: undefined,
        modules: ['nwrx/core'],
        nodes: {
          [node1.id]: {
            kind: 'nwrx/core:json-parse',
          },
        },
      })
    })

    it('should store the metadata of the nodes', async() => {
      const flow = createFlow({ modules: [moduleCore] })
      const node1 = await flow.nodeCreate('nwrx/core:json-parse', {
        meta: {
          isCollapsed: true,
          position: { x: 100, y: 200 },
        },
      })

      const json = flowToJson(flow)
      expect(json).toStrictEqual({
        version: '1',
        name: undefined,
        icon: undefined,
        description: undefined,
        modules: ['nwrx/core'],
        nodes: {
          [node1.id]: {
            kind: 'nwrx/core:json-parse',
            _position: { x: 100, y: 200 },
            _isCollapsed: true,
          },
        },
      })
    })

    it('should not store unused modules', () => {
      const flow = createFlow({ modules: [moduleCore] })
      const json = flowToJson(flow)
      expect(json).toStrictEqual({
        version: '1',
        name: undefined,
        icon: undefined,
        description: undefined,
        modules: [],
        nodes: {},
      })
    })

    it('should store the node data as strings', async() => {
      const flow = createFlow({ modules: [moduleCore] })
      const node1 = await flow.nodeCreate('nwrx/core:json-parse')
      node1.data.json = '{"message":"Hello, world!"}'

      const json = flowToJson(flow)
      expect(json).toStrictEqual({
        version: '1',
        name: undefined,
        icon: undefined,
        description: undefined,
        modules: ['nwrx/core'],
        nodes: {
          [node1.id]: {
            kind: 'nwrx/core:json-parse',
            json: '{"message":"Hello, world!"}',
          },
        },
      })
    })

    it('should store the node data as references to other nodes', async() => {
      const flow = createFlow({ modules: [moduleCore] })
      const node1 = await flow.nodeCreate('nwrx/core:input')
      const node2 = await flow.nodeCreate('nwrx/core:output')
      flow.linkCreate(`${node1.id}:value`, `${node2.id}:value`)

      const json = flowToJson(flow)
      expect(json).toStrictEqual({
        version: '1',
        name: undefined,
        icon: undefined,
        description: undefined,
        modules: ['nwrx/core'],
        nodes: {
          [node1.id]: {
            kind: 'nwrx/core:input',
          },
          [node2.id]: {
            kind: 'nwrx/core:output',
            value: `$NODE.${node1.id}:value`,
          },
        },
      })
    })

    it('should store the position of the nodes', async() => {
      const flow = createFlow({ modules: [moduleCore] })
      const node1 = await flow.nodeCreate('nwrx/core:input', { meta: { position: { x: 10, y: 20 } } })
      const node2 = await flow.nodeCreate('nwrx/core:output', { meta: { position: { x: 30, y: 40 } } })

      const json = flowToJson(flow)
      expect(json).toStrictEqual({
        version: '1',
        name: undefined,
        icon: undefined,
        description: undefined,
        modules: ['nwrx/core'],
        nodes: {
          [node1.id]: {
            kind: 'nwrx/core:input',
            _position: { x: 10, y: 20 },
          },
          [node2.id]: {
            kind: 'nwrx/core:output',
            _position: { x: 30, y: 40 },
          },
        },
      })
    })
  })
}
