/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { moduleCore, nodeJsonParse, typeNumber } from './__fixtures__'
import { createFlow } from './createFlow'
import { createFlowNodeInstance } from './createNodeInstance'
import { defineNode } from './defineNode'

describe('createFlow', () => {
  describe('constructor', () => {
    it('should create a flow with no modules', () => {
      using flow = createFlow()
      expect(flow).toMatchObject({
        meta: {},
        nodes: [],
        links: [],
        modules: [],
        eventTarget: expect.any(EventTarget),
      })
    })

    it('should create a flow with specified meta properties', () => {
      using flow = createFlow({ meta: { name: 'Flow', icon: 'flow', description: 'A flow' } })
      expect(flow).toMatchObject({
        meta: { name: 'Flow', icon: 'flow', description: 'A flow' },
        nodes: [],
        links: [],
        modules: [],
        eventTarget: expect.any(EventTarget),
      })
    })

    it('should create a flow with specified modules', () => {
      using flow = createFlow({ modules: [moduleCore] })
      expect(flow.modules).toStrictEqual([moduleCore])
    })
  })

  describe('eventTarget', () => {
    it('should dispatch an event and call the listener', () => {
      using flow = createFlow()
      const listener = vi.fn()
      flow.on('node:data', listener)
      flow.dispatch('node:data', 'node-id', { string: 'Hello, World!' } )
      expect(listener).toHaveBeenCalledWith('node-id', { string: 'Hello, World!' })
    })

    it('should remove the listener when calling the return value of on', () => {
      using flow = createFlow()
      const listener = vi.fn()
      const removeListener = flow.on('node:data', listener)
      removeListener()
      flow.dispatch('node:data', 'node-id', { string: 'Hello, World!' } )
      expect(listener).not.toHaveBeenCalled()
    })
  })

  describe('setMeta', () => {
    it('should set the settings of the flow', () => {
      using flow = createFlow()
      flow.setMeta({
        name: 'Flow',
        icon: 'flow',
        description: 'A flow',
      })
      expect(flow.meta).toMatchObject({
        name: 'Flow',
        icon: 'flow',
        description: 'A flow',
      })
    })

    it('should merge the settings with the existing settings', () => {
      using flow = createFlow({ meta: { name: 'Flow', icon: undefined, description: 'A flow' } })
      flow.setMeta({ name: 'New Flow', icon: 'flow' })
      expect(flow.meta).toMatchObject({
        name: 'New Flow',
        icon: 'flow',
        description: 'A flow',
      })
    })

    it('should set a single value in the meta object', () => {
      using flow = createFlow({ meta: { name: 'Flow' } })
      flow.setMetaValue('icon', 'flow')
      expect(flow.meta).toMatchObject({ name: 'Flow', icon: 'flow' })
    })

    it('should emit the "flow:meta" event when the settings are set', () => {
      using flow = createFlow()
      const listener = vi.fn()
      flow.on('flow:meta', listener)
      flow.setMeta({ name: 'Flow', icon: 'flow', description: 'A flow' })
      expect(listener).toHaveBeenCalledWith({ name: 'Flow', icon: 'flow', description: 'A flow' })
    })

    it('should emit the entire meta object when partially updated', () => {
      using flow = createFlow({ meta: { name: 'Flow' } })
      const listener = vi.fn()
      flow.on('flow:meta', listener)
      flow.setMeta({ icon: 'flow' })
      expect(listener).toHaveBeenCalledWith({ name: 'Flow', icon: 'flow' })
    })

    it('should emit the "flow:metaValue" event when a single value is set', () => {
      using flow = createFlow({ meta: { name: 'Flow' } })
      const listener = vi.fn()
      flow.on('flow:metaValue', listener)
      flow.setMetaValue('icon', 'flow')
      expect(listener).toHaveBeenCalledWith('icon', 'flow')
    })
  })

  describe('resolveNodeDefinition', () => {
    it('should get the node definition given a node kind', () => {
      using flow = createFlow({ modules: [moduleCore] })
      const node = flow.resolveNodeDefinition('nwrx/core:parse-json')
      expect(node).toStrictEqual(nodeJsonParse)
    })

    it('should throw an error if the node kind is not found', () => {
      using flow = createFlow({ modules: [moduleCore] })
      // @ts-expect-error: Test invalid node kind
      const shouldThrow = () => flow.resolveNodeDefinition('nwrx/core:unknown')
      expect(shouldThrow).toThrow('Node definition "unknown" was not found in module "nwrx/core"')
    })

    it('should throw an error if the module is not found', () => {
      using flow = createFlow({ modules: [moduleCore] })
      // @ts-expect-error: Test invalid module kind
      const shouldThrow = () => flow.resolveNodeDefinition('unknown:unknown')
      expect(shouldThrow).toThrow('Module "unknown" was not found')
    })
  })

  describe('resolveNodeModule', () => {
    it('should get the module of a node definition', () => {
      using flow = createFlow({ modules: [moduleCore] })
      const module = flow.resolveNodeModule(nodeJsonParse)
      expect(module).toStrictEqual(moduleCore)
    })

    it('should get the module of a node instance', () => {
      using flow = createFlow({ modules: [moduleCore] })
      const node = createFlowNodeInstance({ flow, node: nodeJsonParse })
      const module = flow.resolveNodeModule(node)
      expect(module).toStrictEqual(moduleCore)
    })

    it('should throw an error if the module is not found', () => {
      using flow = createFlow({ modules: [moduleCore] })
      const node = { ...nodeJsonParse, kind: 'unknown:unknown' }
      const shouldThrow = () => flow.resolveNodeModule(node)
      expect(shouldThrow).toThrow('Module for node "unknown:unknown" was not found')
    })
  })

  describe('nodeCreate', () => {
    describe('when creating a node instance', () => {
      it('should create a node instance given a node definition', () => {
        using flow = createFlow({ modules: [moduleCore] })
        flow.nodeCreate(nodeJsonParse)
        expect(flow.nodes).toHaveLength(1)
        expect(flow.nodes[0].node).toStrictEqual(nodeJsonParse)
      })

      it('should create a node instance given a node definition and meta', () => {
        using flow = createFlow({ modules: [moduleCore] })
        flow.nodeCreate(moduleCore.nodes![0], { meta: { label: 'Node' } })
        expect(flow.nodes).toHaveLength(1)
        expect(flow.nodes[0]).toMatchObject({ meta: { label: 'Node' } })
      })

      it('should create a node with a node kind', () => {
        using flow = createFlow({ modules: [moduleCore] })
        flow.nodeCreate('nwrx/core:parse-json')
        expect(flow.nodes).toHaveLength(1)
        expect(flow.nodes[0].node).toStrictEqual(nodeJsonParse)
      })

      it('should create a node with a node kind and meta', () => {
        using flow = createFlow({ modules: [moduleCore] })
        flow.nodeCreate('nwrx/core:parse-json', { meta: { label: 'Node' } })
        expect(flow.nodes).toHaveLength(1)
        expect(flow.nodes[0]).toMatchObject({ meta: { label: 'Node' } })
      })

      it('should create a node instance with the given ID', () => {
        using flow = createFlow({ modules: [moduleCore] })
        flow.nodeCreate('nwrx/core:parse-json', { id: 'node-id' })
        expect(flow.nodes[0].id).toBe('node-id')
      })

      it('should emit a node:create event', () => {
        using flow = createFlow({ modules: [moduleCore] })
        const listener = vi.fn()
        flow.on('node:create', listener)
        const node = flow.nodeCreate('nwrx/core:parse-json')
        expect(listener).toHaveBeenCalledWith(node)
      })

      it('should not resolve the data schema of the node when created', () => {
        using flow = createFlow({ modules: [moduleCore] })
        const node = flow.nodeCreate(defineNode({
          kind: 'nwrx/core:parse-json',
          defineDataSchema: () => ({
            number: { name: 'Number', type: typeNumber, control: 'slider' },
          }),
        }))
        expect(node.dataSchema).toStrictEqual({})
      })

      it('should resolve the result schema of the node when created', () => {
        using flow = createFlow({ modules: [moduleCore] })
        const node = flow.nodeCreate(defineNode({
          kind: 'nwrx/core:boolean-to-number',
          defineResultSchema: () => ({
            boolean: { name: 'Boolean', type: typeNumber },
          }),
        }))
        expect(node.resultSchema).toStrictEqual({
          boolean: { name: 'Boolean', type: typeNumber },
        })
      })

      it('should not emit the "node:dataSchema" event when created', () => {
        using flow = createFlow({ modules: [moduleCore] })
        const listener = vi.fn()
        flow.on('node:dataSchema', listener)
        flow.nodeCreate('nwrx/core:parse-json')
        expect(listener).not.toHaveBeenCalled()
      })

      it('should not emit the "node:resultSchema" event when created', () => {
        using flow = createFlow({ modules: [moduleCore] })
        const listener = vi.fn()
        flow.on('node:resultSchema', listener)
        flow.nodeCreate('nwrx/core:parse-json')
        expect(listener).not.toHaveBeenCalled()
      })

      it('should throw an error if the node kind is not found', () => {
        using flow = createFlow({ modules: [moduleCore] })
        const shouldThrow = () => flow.nodeCreate('nwrx/core:unknown')
        expect(shouldThrow).toThrow('Node definition "unknown" was not found in module "nwrx/core"')
      })

      it('should throw an error if the module is not found', () => {
        using flow = createFlow({ modules: [moduleCore] })
        const shouldThrow = () => flow.nodeCreate('unknown:unknown')
        expect(shouldThrow).toThrow('Module "unknown" was not found')
      })
    })

    describe('with event listeners', () => {
      it('should emit a node:data event when the data of a node is set', () => {
        using flow = createFlow({ modules: [moduleCore] })
        const node = flow.nodeCreate('nwrx/core:parse-json')
        const listener = vi.fn()
        flow.on('node:data', listener)
        node.setDataValue('json', '{"key": "value"}')
        expect(listener).toHaveBeenCalledOnce()
        expect(listener).toHaveBeenCalledWith(node.id, { json: '{"key": "value"}' })
      })

      it('should emit a node:result event when the result of a node is set', () => {
        using flow = createFlow({ modules: [moduleCore] })
        const node = flow.nodeCreate('nwrx/core:parse-json')
        const listener = vi.fn()
        flow.on('node:result', listener)
        node.setResultValue('object', { key: 'value' })
        expect(listener).toHaveBeenCalledOnce()
        expect(listener).toHaveBeenCalledWith(node.id, { object: { key: 'value' } })
      })

      it('should emit a node:dataSchema event when the data schema of a node is resolved', async() => {
        using flow = createFlow({ modules: [moduleCore] })
        const node = flow.nodeCreate({ kind: 'nwrx/core:parse-json', defineDataSchema: () => ({}) })
        const listener = vi.fn()
        flow.on('node:dataSchema', listener)
        await node.resolveDataSchema()
        expect(listener).toHaveBeenCalledWith(node.id, node.dataSchema)
      })

      it('should emit a node:resultSchema event when the result schema of a node is resolved', async() => {
        using flow = createFlow({ modules: [moduleCore] })
        const node = flow.nodeCreate({ kind: 'nwrx/core:parse-json', defineResultSchema: () => ({}) })
        const listener = vi.fn()
        flow.on('node:resultSchema', listener)
        await node.resolveResultSchema()
        expect(listener).toHaveBeenCalledWith(node.id, node.resultSchema)
      })
    })
  })

  describe('nodeRemove', () => {
    it('should remove a node from the flow', () => {
      using flow = createFlow({ modules: [moduleCore] })
      const node = flow.nodeCreate('nwrx/core:parse-json')
      flow.nodeRemove(node.id)
      expect(flow.nodes).toHaveLength(0)
    })

    it('should emit a node:remove event', () => {
      using flow = createFlow({ modules: [moduleCore] })
      const node = flow.nodeCreate('nwrx/core:parse-json')
      const listener = vi.fn()
      flow.on('node:remove', listener)
      flow.nodeRemove(node.id)
      expect(listener).toHaveBeenCalledWith(node.id)
    })

    it('should throw an error if the node does not exist', () => {
      using flow = createFlow()
      const shouldThrow = () => flow.nodeRemove('node-id')
      expect(shouldThrow).toThrow('Node instance with ID "node-id" does not exist')
    })
  })

  describe('getNodeInstance', () => {
    it('should get a node instance given an ID', () => {
      using flow = createFlow({ modules: [moduleCore] })
      const node = flow.nodeCreate('nwrx/core:parse-json')
      const instance = flow.getNodeInstance(node.id)
      expect(instance).toBe(node)
    })

    it('should throw an error if the node does not exist', () => {
      using flow = createFlow()
      const shouldThrow = () => flow.getNodeInstance('node-id')
      expect(shouldThrow).toThrow('Node instance with ID "node-id" does not exist')
    })
  })

  describe('getDataSocket', () => {
    it('should get the data port of a node given a composite ID', () => {
      using flow = createFlow({ modules: [moduleCore] })
      const node = flow.nodeCreate('nwrx/core:parse-json')
      const port = flow.getDataSocket(`${node.id}:json`)
      expect(port).toBe(node.dataSchema?.json)
    })

    it('should throw an error if the node does not exist', () => {
      using flow = createFlow()
      const shouldThrow = () => flow.getDataSocket('node-id:string')
      expect(shouldThrow).toThrow('Node instance with ID "node-id" does not exist')
    })
  })

  describe('getResultSocket', () => {
    it('should get the result port of a node given a composite ID', () => {
      using flow = createFlow({ modules: [moduleCore] })
      const node = flow.nodeCreate('nwrx/core:parse-json')
      const port = flow.getResultSocket(`${node.id}:object`)
      expect(port).toBe(node.resultSchema?.object)
    })

    it('should throw an error if the node does not exist', () => {
      using flow = createFlow()
      const shouldThrow = () => flow.getResultSocket('node-id:boolean')
      expect(shouldThrow).toThrow('Node instance with ID "node-id" does not exist')
    })
  })

  describe('linkCreate', () => {
    it('should link the output of a node to the input of another node', () => {
      using flow = createFlow({ modules: [moduleCore] })
      const node1 = flow.nodeCreate('nwrx/core:input')
      const node2 = flow.nodeCreate('nwrx/core:parse-json')
      flow.linkCreate(`${node1.id}:value`, `${node2.id}:json`)
      expect(flow.links).toStrictEqual([{ source: `${node1.id}:value`, target: `${node2.id}:json` }])
    })

    it('should emit a node:dataRaw event when the data of a node is set', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const node1 = flow.nodeCreate('nwrx/core:input')
      const node2 = flow.nodeCreate('nwrx/core:parse-json')
      const listener = vi.fn()
      flow.on('node:dataRaw', listener)
      flow.linkCreate(`${node1.id}:value`, `${node2.id}:json`)
      expect(listener).toHaveBeenCalledOnce()
      expect(listener).toHaveBeenCalledWith(node2.id, { json: `$NODE.${node1.id}:value` })
    })

    it('should remove the existing link if the target is already linked to another source', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const node1 = flow.nodeCreate('nwrx/core:input')
      const node2 = flow.nodeCreate('nwrx/core:input')
      const node3 = flow.nodeCreate('nwrx/core:parse-json')
      flow.linkCreate(`${node1.id}:value`, `${node3.id}:json`)
      flow.linkCreate(`${node2.id}:value`, `${node3.id}:json`)
      expect(flow.links).toStrictEqual([{ source: `${node2.id}:value`, target: `${node3.id}:json` }])
    })

    it('should throw an error if the source and target are the same', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const node = flow.nodeCreate('nwrx/core:parse-json')
      const shouldThrow = () => flow.linkCreate(`${node.id}:object`, `${node.id}:json`)
      expect(shouldThrow).toThrow('Cannot link the node to itself')
    })

    it('should throw an error if the source and target are of different types', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const node1 = flow.nodeCreate('nwrx/core:parse-json')
      const node2 = flow.nodeCreate('nwrx/core:output')
      const shouldThrow = () => flow.linkCreate(`${node1.id}:object`, `${node2.id}:value`)
      expect(shouldThrow).toThrow('Cannot link Object to String')
    })

    it('should throw an error if the source does not exist', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const node = flow.nodeCreate('nwrx/core:parse-json')
      const shouldThrow = () => flow.linkCreate('unknown:boolean', `${node.id}:string`)
      expect(shouldThrow).toThrow('Node instance with ID "unknown" does not exist')
    })

    it('should throw an error if the port of the source does not exist', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const node = flow.nodeCreate('nwrx/core:parse-json')
      const shouldThrow = () => flow.linkCreate(`${node.id}:unknown`, `${node.id}:string`)
      expect(shouldThrow).toThrow(/The result schema of node "[\da-z\-]+" does not contain a port with the key "unknown"/)
    })

    it('should throw an error if the target does not exist', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const node = flow.nodeCreate('nwrx/core:parse-json')
      const shouldThrow = () => flow.linkCreate(`${node.id}:object`, 'unknown:string')
      expect(shouldThrow).toThrow('Node instance with ID "unknown" does not exist')
    })

    it('should throw an error if the port of the target does not exist', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const node1 = flow.nodeCreate('nwrx/core:parse-json')
      const node2 = flow.nodeCreate('nwrx/core:output')
      const shouldThrow = () => flow.linkCreate(`${node1.id}:object`, `${node2.id}:unknown`)
      expect(shouldThrow).toThrow(/The data schema of node "[\da-z\-]+" does not contain a port with the key "unknown"/)
    })
  })

  describe('linkRemove', () => {
    it('should remove a link specified by the source', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const node1 = flow.nodeCreate('nwrx/core:input')
      const node2 = flow.nodeCreate('nwrx/core:parse-json')
      flow.linkCreate(`${node1.id}:value`, `${node2.id}:json`)
      flow.linkRemove(`${node1.id}:value`)
      expect(flow.links).toHaveLength(0)
    })

    it('should remove a link specified by the target', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const node1 = flow.nodeCreate('nwrx/core:input')
      const node2 = flow.nodeCreate('nwrx/core:parse-json')
      flow.linkCreate(`${node1.id}:value`, `${node2.id}:json`)
      flow.linkRemove(`${node2.id}:json`)
      expect(flow.links).toHaveLength(0)
    })

    it('should remove all links associated with a result port', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const node1 = flow.nodeCreate('nwrx/core:input')
      const node2 = flow.nodeCreate('nwrx/core:parse-json')
      const node3 = flow.nodeCreate('nwrx/core:parse-json')
      flow.linkCreate(`${node1.id}:value`, `${node2.id}:json`)
      flow.linkCreate(`${node1.id}:value`, `${node3.id}:json`)
      flow.linkRemove(`${node1.id}:value`)
      expect(flow.links).toHaveLength(0)
    })
  })

  describe('run', () => {
    it('should emit the "flow:start" event', () => {
      using flow = createFlow()
      const listener = vi.fn()
      flow.on('flow:start', listener)
      flow.start()
      expect(listener).toHaveBeenCalledOnce()
    })

    // it('should start the execution of the flow', async() => {
    //   using flow = createFlow({ modules: [moduleCore] })

    //   const node1 = flow.nodeCreate('nwrx/core:input', {
    //     initialData: { property: 'value' },
    //   })

  //   const node2 = flow.nodeCreate('nwrx/core:parse-json')
  //   flow.linkCreate(`${node1.id}:value`, `${node2.id}:json`)
  //   flow.run()
  //   expect(node1.result).toStrictEqual({ value: undefined })
  // })
  })

  describe('abort', () => {
    it('should abort the flow', () => {
      using flow = createFlow({ modules: [moduleCore] })
      flow.abort()
      expect(flow.isRunning).toBe(false)
    })

    it('should emit the "flow:abort" event', () => {
      using flow = createFlow({ modules: [moduleCore] })
      const listener = vi.fn()
      flow.on('flow:abort', listener)
      flow.abort()
      expect(listener).toHaveBeenCalledOnce()
    })
  })
})
