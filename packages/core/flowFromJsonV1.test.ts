import { moduleCore } from './__fixtures__'
import { flowFromJsonV1 } from './flowFromJsonV1'

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
          kind: 'nwrx/core:parse-json',
          json: '{ "key": "value" }',
          _position: { x: 100, y: 100 },
        },
      },
    }, [moduleCore])

    expect(flow).toMatchObject({
      links: [],
      nodes: [
        {
          node: { kind: 'parse-json' },
          dataRaw: { json: '{ "key": "value" }' },
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
          kind: 'nwrx/core:parse-json',
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
          kind: 'nwrx/core:parse-json',
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
          kind: 'nwrx/core:parse-json',
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
    const shouldReject = flowFromJsonV1({ version: '1', nodes: { 0: { kind: 'nwrx/core:parse-json' } } })
    await expect(shouldReject).rejects.toThrow('Module "nwrx/core" was not found in the globally registered modules')
  })

  it('should throw if a node is missing the kind', async() => {
    // @ts-expect-error: Testing invalid input
    const shouldReject = flowFromJsonV1({ version: '1', nodes: { 0: {} } })
    await expect(shouldReject).rejects.toThrow('Node kind is missing')
  })
})
