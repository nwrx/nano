import { moduleCore } from './__fixtures__'
import { createFlow } from './createFlow'
import { flowToJson } from './flowToJson'

describe('flowToJson', () => {
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
    const node1 = await flow.nodeCreate('nwrx/core:parse-json')
    const json = flowToJson(flow)
    expect(json).toStrictEqual({
      version: '1',
      name: undefined,
      icon: undefined,
      description: undefined,
      modules: ['nwrx/core'],
      nodes: {
        [node1.id]: {
          kind: 'nwrx/core:parse-json',
        },
      },
    })
  })

  it('should store the metadata of the nodes', async() => {
    const flow = createFlow({ modules: [moduleCore] })
    const node1 = await flow.nodeCreate('nwrx/core:parse-json', {
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
          kind: 'nwrx/core:parse-json',
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

  it('should store the node raw data as strings', async() => {
    const flow = createFlow({ modules: [moduleCore] })
    const node1 = await flow.nodeCreate('nwrx/core:parse-json')
    node1.dataRaw.json = '{"message":"Hello, world!"}'

    const json = flowToJson(flow)
    expect(json).toStrictEqual({
      version: '1',
      name: undefined,
      icon: undefined,
      description: undefined,
      modules: ['nwrx/core'],
      nodes: {
        [node1.id]: {
          kind: 'nwrx/core:parse-json',
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
