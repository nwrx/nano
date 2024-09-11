import type { FlowModule } from './defineFlowModule'
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
export async function flowFromJsonV1<T extends FlowModule = FlowModule>(json: FlowExportV1, modules: T[] = []): Promise<Flow<T>> {
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
    for (const key in data) {
      const value = data[key]

      // --- If the key starts with an underscore, store it as meta data.
      if (key.startsWith('_')) {
        const metaKey = key.slice(1)
        meta[metaKey] = value
      }

      // --- If the value is a reference to another node, store it as a link.
      else if (typeof value === 'string' && value.startsWith('$NODE.')) {
        const source = value.slice(6)
        const target = `${id}:${key}`
        flow.links.push({ source, target })
      }

      // --- Otherwise, store the value as initial data.
      else {
        initialData[key] = value
      }
    }

    // --- Create the node instance.
    await flow.nodeCreate(kind, { id, meta, initialData })
  }

  // --- Return the flow instance.
  return flow
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { moduleCore } = await import('./__fixtures__')

  describe('flowFromJsonV1', () => {
    it('should restore the flow meta data', async() => {
      const flow = await flowFromJsonV1({
        version: '1',
        name: 'Flow',
        icon: 'flow',
        description: 'A flow',
        additional: 'data',
      })
      expect(flow.meta).toStrictEqual({
        name: 'Flow',
        icon: 'flow',
        description: 'A flow',
        additional: 'data',
      })
    })

    it('should import the flow and restore the nodes', async() => {
      const flow = await flowFromJsonV1({
        version: '1',
        nodes: {
          '000': {
            kind: 'nwrx/core:json-parse',
            json: '{ "key": "value" }',
            _position: { x: 100, y: 100 },
          },
        },
      }, [moduleCore])

      expect(flow).toMatchObject({
        links: [],
        nodes: [
          {
            node: { kind: 'json-parse' },
            data: { json: '{ "key": "value" }' },
            result: {},
          },
        ],
      })
    })

    it('should restore the original ID of the nodes', async() => {
      const flow = await flowFromJsonV1({
        version: '1',
        nodes: {
          '0123': {
            kind: 'nwrx/core:json-parse',
            json: '{ "key": "value" }',
          },
        },
      }, [moduleCore])

      expect(flow.nodes[0].id).toBe('0123')
    })

    it('should restore the meta data of the nodes', async() => {
      const flow = await flowFromJsonV1({
        version: '1',
        nodes: {
          '000': {
            kind: 'nwrx/core:json-parse',
            json: '{ "key": "value" }',
            _position: { x: 100, y: 100 },
          },
        },
      }, [moduleCore])

      expect(flow.nodes[0].meta).toStrictEqual({ position: { x: 100, y: 100 } })
    })

    it('should restore the links between the nodes', async() => {
      const flow = await flowFromJsonV1({
        version: '1',
        nodes: {
          '000': {
            kind: 'nwrx/core:input',
            json: '{ "key": "value" }',
          },
          '001': {
            kind: 'nwrx/core:json-parse',
            value: '$NODE.000:json',
          },
        },
      }, [moduleCore])

      expect(flow.links).toStrictEqual([
        { source: '000:json', target: '001:value' },
      ])
    })

    it('should throw an error if the flow file version is missing', async() => {
      const shouldReject = flowFromJsonV1({ nodes: {} })
      await expect(shouldReject).rejects.toThrow('Flow file version is missing')
    })

    it('should throw if the flow file version is unsupported', async() => {
      const shouldReject = flowFromJsonV1({ version: '0', nodes: {} })
      await expect(shouldReject).rejects.toThrow('Unsupported flow file version: 0')
    })

    it('should throw if a module is not found', async() => {
      const shouldReject = flowFromJsonV1({ version: '1', nodes: { 0: { kind: 'nwrx/core:json-parse' } } })
      await expect(shouldReject).rejects.toThrow('Module "nwrx/core" was not found in the globally registered modules')
    })

    it('should throw if a node is missing the kind', async() => {
      // @ts-expect-error: Testing invalid input
      const shouldReject = flowFromJsonV1({ version: '1', nodes: { 0: {} } })
      await expect(shouldReject).rejects.toThrow('Node kind is missing')
    })
  })
}
