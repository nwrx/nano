/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Node } from './defineNode'
import { EXP_UUID } from '@unshared/validation'
import { nodeInput, nodeParse, typeNumber, typeString } from './__fixtures__'
import { createFlow, Flow, NODE_INPUT_KIND, NODE_OUTPUT_KIND } from './createFlow'
import { defineNode } from './defineNode'

describe('createFlow', () => {
  describe('constructor', () => {
    it('should create a flow instance', () => {
      using flow = createFlow()
      expect(flow).toBeInstanceOf(Flow)
    })

    it('should create a flow with specified meta properties', () => {
      using flow = createFlow({ meta: { name: 'Flow', icon: 'flow', description: 'A flow' } })
      expect(flow).toMatchObject({ meta: { name: 'Flow', icon: 'flow', description: 'A flow' } })
    })
  })

  describe('eventTarget', () => {
    it('should dispatch an event when an internal event is emitted', () => {
      using flow = createFlow()
      const listener = vi.fn()
      flow.on('flow:meta', listener)
      flow.setMeta('foo', 'bar')
      expect(listener).toHaveBeenCalledWith('foo', 'bar')
    })

    it('should remove the listener when calling the return value of on', () => {
      using flow = createFlow()
      const listener = vi.fn()
      const removeListener = flow.on('flow:meta', listener)
      removeListener()
      flow.setMeta('foo', 'bar')
      expect(listener).not.toHaveBeenCalled()
    })

    it('should remove all listeners when calling the `destroy` method', () => {
      using flow = createFlow()
      const listener = vi.fn()
      flow.on('flow:meta', listener)
      flow.destroy()
      flow.setMeta('foo', 'bar')
      expect(listener).not.toHaveBeenCalled()
    })
  })

  describe('setMeta', () => {
    it('should set the settings of the flow', () => {
      using flow = createFlow()
      flow.setMeta('name', 'Flow')
      flow.setMeta('icon', 'flow')
      flow.setMeta('description', 'A flow')
      expect(flow.meta).toMatchObject({ name: 'Flow', icon: 'flow', description: 'A flow' })
    })

    it('should emit the "flow:meta" event when the settings are set', () => {
      using flow = createFlow()
      const listener = vi.fn()
      flow.on('flow:meta', listener)
      flow.setMeta('name', 'Flow')
      expect(listener).toHaveBeenCalledWith('name', 'Flow')
    })

    it('should override the existing meta value with the new value', () => {
      using flow = createFlow({ meta: { name: 'Flow' } })
      flow.setMeta('name', 'New Flow')
      expect(flow.meta).toMatchObject({ name: 'New Flow' })
    })
  })

  describe('add', () => {
    describe('instantiation', () => {
      it('should create a node instance from the given node definition', async() => {
        using flow = createFlow()
        const instance = await flow.add(nodeParse)
        expect(instance).toMatchObject({ node: nodeParse })
      })

      it('should create a node using syncroneous `resolveNode` method', async() => {
        const resolveNode = vi.fn(() => nodeParse) as () => Node
        using flow = createFlow({ resolveNode })
        const instance = await flow.add('anything')
        expect(resolveNode).toHaveBeenCalledWith('anything')
        expect(instance).toMatchObject({ node: nodeParse })
      })

      it('should set the flow property of the node instance', async() => {
        using flow = createFlow()
        const node = await flow.add(nodeParse)
        expect(node.flow).toBe(flow)
      })

      it('should add the node instance to the flow', async() => {
        using flow = createFlow()
        const node = await flow.add(nodeParse)
        expect(flow.nodes).toContain(node)
      })

      it('should set the meta properties of the node instance', async() => {
        using flow = createFlow()
        const instance = await flow.add(nodeParse, { meta: { label: 'Node' } })
        expect(instance.meta).toMatchObject({ label: 'Node' })
      })

      it('should create a node instance with the given ID', async() => {
        using flow = createFlow()
        const node = await flow.add(nodeParse, { id: 'node-id' })
        expect(node.id).toBe('node-id')
      })
    })

    describe('schema', () => {
      it('should not resolve the data schema of the node when created', async() => {
        using flow = createFlow()
        const listener = vi.fn()
        flow.on('node:dataSchema', listener)
        const node = defineNode({ kind: 'boolean', dataSchema: () => ({ boolean: { type: typeNumber } }) })
        const instance = await flow.add(node)
        expect(instance.dataSchema).toStrictEqual({})
        expect(listener).not.toHaveBeenCalled()
      })

      it('should not resolve the result schema of the node when created', async() => {
        using flow = createFlow()
        const listener = vi.fn()
        flow.on('node:resultSchema', listener)
        const node = defineNode({ kind: 'boolean', resultSchema: () => ({ boolean: { type: typeNumber } }) })
        const instance = await flow.add(node)
        expect(instance.resultSchema).toStrictEqual({})
        expect(listener).not.toHaveBeenCalled()
      })

      it('should not resolve the data of the node when created', async() => {
        using flow = createFlow()
        const instance = await flow.add(nodeParse, { initialData: { json: '{"key": "value"}' } })
        expect(instance.dataResolved).toStrictEqual({})
      })
    })

    describe('event', () => {
      it('should emit a node:create event', async() => {
        using flow = createFlow()
        const listener = vi.fn()
        flow.on('node:create', listener)
        const node = await flow.add(nodeParse)
        expect(listener).toHaveBeenCalledWith(node)
      })

      it('should emit a node:data event when the data of a node is set', async() => {
        using flow = createFlow()
        const instance = await flow.add(nodeParse)
        const listener = vi.fn()
        flow.on('node:data', listener)
        instance.setDataValue('json', '{"key": "value"}')
        expect(listener).toHaveBeenCalledOnce()
        expect(listener).toHaveBeenCalledWith(instance, { json: '{"key": "value"}' }, {
          state: 'IDLE',
          delta: expect.any(Number),
          duration: expect.any(Number),
          executionId: expect.stringMatching(EXP_UUID),
          threadId: expect.stringMatching(EXP_UUID),
          timestamp: expect.any(Number),
        })
      })

      it('should emit a node:result event when the result of a node is set', async() => {
        using flow = createFlow()
        const node = await flow.add(nodeParse)
        const listener = vi.fn()
        flow.on('node:result', listener)
        // @ts-expect-error: Method is private
        node.setResult({ object: { key: 'value' } })
        expect(listener).toHaveBeenCalledOnce()
        expect(listener).toHaveBeenCalledWith(node, { object: { key: 'value' } }, {
          state: 'IDLE',
          delta: expect.any(Number),
          duration: expect.any(Number),
          executionId: expect.stringMatching(EXP_UUID),
          threadId: expect.stringMatching(EXP_UUID),
          timestamp: expect.any(Number),
        })
      })

      it('should emit a node:dataSchema event when the data schema of a node is resolved', async() => {
        using flow = createFlow()
        const listener = vi.fn()
        flow.on('node:dataSchema', listener)
        const dataSchema = { boolean: { type: typeNumber } }
        const node = defineNode({ kind: 'boolean', dataSchema: () => dataSchema })
        const instance = await flow.add(node)
        // @ts-expect-error: dataSchema is private
        await instance.resolveDataSchema()
        expect(listener).toHaveBeenCalledWith(instance, dataSchema, {
          state: 'IDLE',
          delta: expect.any(Number),
          duration: expect.any(Number),
          executionId: expect.stringMatching(EXP_UUID),
          threadId: expect.stringMatching(EXP_UUID),
          timestamp: expect.any(Number),
        })
      })

      it('should emit a node:resultSchema event when the result schema of a node is resolved', async() => {
        using flow = createFlow()
        const listener = vi.fn()
        flow.on('node:resultSchema', listener)
        const resultSchema = { boolean: { type: typeNumber } }
        const definition = defineNode({ kind: 'boolean', resultSchema: () => resultSchema })
        const node = await flow.add(definition)
        // @ts-expect-error: resultSchema is private
        await node.resolveResultSchema()
        expect(listener).toHaveBeenCalledWith(node, resultSchema, {
          state: 'IDLE',
          delta: expect.any(Number),
          duration: expect.any(Number),
          executionId: expect.stringMatching(EXP_UUID),
          threadId: expect.stringMatching(EXP_UUID),
          timestamp: expect.any(Number),
        })
      })
    })
  })

  describe('remove', () => {
    it('should remove a node from the flow', async() => {
      using flow = createFlow()
      const node = await flow.add(nodeParse)
      flow.remove(node.id)
      expect(flow.nodes).toHaveLength(0)
    })

    it('should remove mulitple nodes from the flow', async() => {
      using flow = createFlow()
      const node1 = await flow.add(nodeParse)
      const node2 = await flow.add(nodeParse)
      flow.remove(node1.id, node2.id)
      expect(flow.nodes).toHaveLength(0)
    })

    it('should emit a node:remove event', async() => {
      using flow = createFlow()
      const node = await flow.add(nodeParse)
      const listener = vi.fn()
      flow.on('node:remove', listener)
      flow.remove(node.id)
      expect(listener).toHaveBeenCalledWith(node)
    })

    it('should throw an error if the node does not exist', () => {
      using flow = createFlow()
      const shouldThrow = () => flow.remove('node-id')
      expect(shouldThrow).toThrow('Node instance with ID "node-id" does not exist')
    })

    it('should throw an error if one of the nodes does not exist', async() => {
      using flow = createFlow()
      const node1 = await flow.add(nodeParse)
      const shouldThrow = () => flow.remove(node1.id, 'unknown')
      expect(shouldThrow).toThrow('Node instance with ID "unknown" does not exist')
      expect(flow.nodes).toHaveLength(1)
    })
  })

  describe('get', () => {
    it('should get a node instance given an ID', async() => {
      using flow = createFlow()
      const node = await flow.add(nodeParse)
      const instance = flow.get(node.id)
      expect(instance).toBe(node)
    })

    it('should throw an error if the node does not exist', () => {
      using flow = createFlow()
      const shouldThrow = () => flow.get('node-id')
      expect(shouldThrow).toThrow('The node with ID "node-id" does not exist')
    })
  })

  describe('link', () => {
    describe('basic', () => {
      const node = defineNode({
        kind: 'boolean',
        dataSchema: {
          a: { type: typeNumber, control: 'socket' },
          b: { type: typeNumber, control: 'socket' },
        },
        resultSchema: {
          a: { type: typeNumber },
          b: { type: typeNumber },
        },
      })

      it('should link the output of a node to the input of another node', async() => {
        using flow = createFlow()
        const node1 = await flow.add(node, { id: 'node-1' })
        const node2 = await flow.add(node, { id: 'node-2' })
        flow.link(node1.id, 'a', node2.id, 'a')
        expect(node2.data).toMatchObject({ a: '$NODE.node-1:a' })
        expect(node1.data).toMatchObject({})
      })

      it('should emit a node:data event when a link is created', async() => {
        using flow = createFlow()
        const listener = vi.fn()
        flow.on('node:data', listener)
        const node1 = await flow.add(node, { id: 'node-1' })
        const node2 = await flow.add(node, { id: 'node-2' })
        flow.link(node1.id, 'a', node2.id, 'a')
        expect(listener).toHaveBeenCalledOnce()
        expect(listener).toHaveBeenCalledWith(node2, { a: '$NODE.node-1:a' }, {
          state: 'IDLE',
          delta: expect.any(Number),
          duration: expect.any(Number),
          executionId: expect.stringMatching(EXP_UUID),
          threadId: expect.stringMatching(EXP_UUID),
          timestamp: expect.any(Number),
        })
      })

      it('should override the existing link if the target is already linked to another source', async() => {
        using flow = createFlow()
        const node1 = await flow.add(node, { id: 'node-1' })
        const node2 = await flow.add(node, { id: 'node-2' })
        const node3 = await flow.add(node, { id: 'node-3' })
        flow.link(node1.id, 'a', node3.id, 'a')
        flow.link(node2.id, 'a', node3.id, 'a')
        expect(node3.data).toMatchObject({ a: `$NODE.${node2.id}:a` })
        expect(node2.data).toMatchObject({})
        expect(node1.data).toMatchObject({})
      })

      it('should link multiple targets from the same source', async() => {
        using flow = createFlow()
        const node1 = await flow.add(node, { id: 'node-1' })
        const node2 = await flow.add(node, { id: 'node-2' })
        const node3 = await flow.add(node, { id: 'node-3' })
        flow.link(node1.id, 'a', node2.id, 'a')
        flow.link(node1.id, 'a', node3.id, 'a')
        expect(node2.data).toMatchObject({ a: '$NODE.node-1:a' })
        expect(node3.data).toMatchObject({ a: '$NODE.node-1:a' })
      })
    })

    describe('iterable', () => {
      const node = defineNode({
        kind: 'boolean',
        dataSchema: {
          a: { type: typeNumber, control: 'socket', isIterable: true },
          b: { type: typeNumber, control: 'socket', isIterable: true },
        },
        resultSchema: {
          a: { type: typeNumber },
          b: { type: typeNumber },
        },
      })

      it('should add a link to an iterable socket', async() => {
        using flow = createFlow()
        const node1 = await flow.add(node, { id: 'node-1' })
        const node2 = await flow.add(node, { id: 'node-2' })
        flow.link(node1.id, 'a', node2.id, 'a')
        expect(node2.data).toMatchObject({ a: ['$NODE.node-1:a'] })
      })

      it('should emit a node:data event when a link is created', async() => {
        using flow = createFlow()
        const listener = vi.fn()
        flow.on('node:data', listener)
        const node1 = await flow.add(node, { id: 'node-1' })
        const node2 = await flow.add(node, { id: 'node-2' })
        flow.link(node1.id, 'a', node2.id, 'a')
        expect(listener).toHaveBeenCalledOnce()
        expect(listener).toHaveBeenCalledWith(node2, { a: ['$NODE.node-1:a'] }, {
          state: 'IDLE',
          delta: expect.any(Number),
          duration: expect.any(Number),
          executionId: expect.stringMatching(EXP_UUID),
          threadId: expect.stringMatching(EXP_UUID),
          timestamp: expect.any(Number),
        })
      })

      it('should add multiple links to an iterable socket', async() => {
        using flow = createFlow()
        const node1 = await flow.add(node, { id: 'node-1' })
        const node2 = await flow.add(node, { id: 'node-2' })
        const node3 = await flow.add(node, { id: 'node-3' })
        flow.link(node1.id, 'a', node3.id, 'a')
        flow.link(node2.id, 'a', node3.id, 'a')
        expect(node3.data).toMatchObject({ a: ['$NODE.node-1:a', `$NODE.${node2.id}:a`] })
      })

      it('should not add duplicate links to an iterable socket', async() => {
        using flow = createFlow()
        const node1 = await flow.add(node, { id: 'node-1' })
        const node2 = await flow.add(node, { id: 'node-2' })
        flow.link(node1.id, 'a', node2.id, 'a')
        flow.link(node1.id, 'a', node2.id, 'a')
        expect(node2.data).toMatchObject({ a: ['$NODE.node-1:a'] })
      })
    })

    describe('edge cases', () => {
      it('should throw an error if the target node does not exist', async() => {
        using flow = createFlow()
        const node = await flow.add(nodeInput)
        const shouldThrow = () => flow.link(node.id, 'value', 'unknown', 'json')
        expect(shouldThrow).toThrow('The node with ID "unknown" does not exist')
      })

      it('should throw an error if the target socket does not exist', async() => {
        using flow = createFlow()
        const node1 = await flow.add(nodeInput)
        const node2 = await flow.add(nodeParse)
        const shouldThrow = () => flow.link(node1.id, 'value', node2.id, 'unknown')
        expect(shouldThrow).toThrow('The data property "unknown" does not exist')
      })

      it('should throw an error if the source node does not exist', async() => {
        using flow = createFlow()
        const node = await flow.add(nodeInput)
        const shouldThrow = () => flow.link('unknown', 'value', node.id, 'json')
        expect(shouldThrow).toThrow('The node with ID "unknown" does not exist')
      })

      it('should throw an error if the source socket does not exist', async() => {
        using flow = createFlow()
        const node1 = await flow.add(nodeInput)
        const node2 = await flow.add(nodeParse)
        const shouldThrow = () => flow.link(node1.id, 'unknown', node2.id, 'json')
        expect(shouldThrow).toThrow('The result property "unknown" does not exist')
      })

      it('should throw an error if the source and target are the same', async() => {
        using flow = createFlow()
        const node = await flow.add(nodeParse)
        const shouldThrow = () => flow.link(node.id, 'object', node.id, 'json')
        expect(shouldThrow).toThrow('Cannot link a node to itself')
      })

      it('should throw an error if the target socket is not a socket', async() => {
        using flow = createFlow()
        const node1 = await flow.add(nodeInput)
        const node2 = await flow.add({ kind: 'boolean', dataSchema: { boolean: { type: typeNumber } } })
        const shouldThrow = () => flow.link(node1.id, 'value', node2.id, 'boolean')
        expect(shouldThrow).toThrow('The data property "boolean" cannot be linked to.')
      })

      it('should throw an error if the source and target are on the same node', async() => {
        using flow = createFlow()
        const node = await flow.add(nodeParse)
        const shouldThrow = () => flow.link(node.id, 'object', node.id, 'json')
        expect(shouldThrow).toThrow('Cannot link a node to itself')
      })
    })
  })

  describe('unlink', () => {
    describe('basic', () => {
      const node = defineNode({
        kind: 'boolean',
        dataSchema: {
          a: { type: typeNumber, control: 'socket' },
          b: { type: typeNumber, control: 'socket' },
        },
        resultSchema: {
          a: { type: typeNumber },
          b: { type: typeNumber },
        },
      })

      it('should remove a link specified by source and target ids and keys', async() => {
        using flow = createFlow()
        const node1 = await flow.add(node, { id: 'node-1' })
        const node2 = await flow.add(node, { id: 'node-2' })
        const node3 = await flow.add(node, { id: 'node-3' })
        flow.link(node1.id, 'a', node2.id, 'a')
        flow.link(node1.id, 'b', node2.id, 'b')
        flow.link(node1.id, 'a', node3.id, 'a')
        flow.link(node1.id, 'b', node3.id, 'b')
        flow.unlink(node1.id, 'b', node2.id, 'b')
        expect(node2.data).toStrictEqual({ a: '$NODE.node-1:a', b: undefined })
        expect(node3.data).toStrictEqual({ a: '$NODE.node-1:a', b: '$NODE.node-1:b' })
      })

      it('should remove links specified by the source and target ids', async() => {
        using flow = createFlow()
        const node1 = await flow.add(node, { id: 'node-1' })
        const node2 = await flow.add(node, { id: 'node-2' })
        const node3 = await flow.add(node, { id: 'node-3' })
        flow.link(node1.id, 'a', node2.id, 'a')
        flow.link(node1.id, 'a', node3.id, 'a')
        flow.link(node1.id, 'b', node2.id, 'b')
        flow.link(node1.id, 'b', node3.id, 'b')
        flow.unlink(node1.id, undefined, node2.id)
        expect(node2.data).toStrictEqual({ a: undefined, b: undefined })
        expect(node3.data).toStrictEqual({ a: '$NODE.node-1:a', b: '$NODE.node-1:b' })
      })

      it('should remove links specified by the source id and key', async() => {
        using flow = createFlow()
        const node1 = await flow.add(node, { id: 'node-1' })
        const node2 = await flow.add(node, { id: 'node-2' })
        const node3 = await flow.add(node, { id: 'node-3' })
        flow.link(node1.id, 'a', node2.id, 'a')
        flow.link(node1.id, 'a', node3.id, 'a')
        flow.link(node1.id, 'b', node2.id, 'b')
        flow.link(node1.id, 'b', node3.id, 'b')
        flow.unlink(node1.id, 'a')
        expect(node2.data).toStrictEqual({ a: undefined, b: '$NODE.node-1:b' })
        expect(node3.data).toStrictEqual({ a: undefined, b: '$NODE.node-1:b' })
      })

      it('should remove links specified by the target id and key', async() => {
        using flow = createFlow()
        const node1 = await flow.add(node, { id: 'node-1' })
        const node2 = await flow.add(node, { id: 'node-2' })
        const node3 = await flow.add(node, { id: 'node-3' })
        flow.link(node1.id, 'a', node2.id, 'a')
        flow.link(node1.id, 'a', node3.id, 'a')
        flow.link(node1.id, 'b', node2.id, 'b')
        flow.link(node1.id, 'b', node3.id, 'b')
        flow.unlink(undefined, undefined, node2.id, 'a')
        expect(node2.data).toStrictEqual({ a: undefined, b: '$NODE.node-1:b' })
        expect(node3.data).toStrictEqual({ a: '$NODE.node-1:a', b: '$NODE.node-1:b' })
      })

      it('should remove all links specified by the source id', async() => {
        using flow = createFlow()
        const node1 = await flow.add(node, { id: 'node-1' })
        const node2 = await flow.add(node, { id: 'node-2' })
        const node3 = await flow.add(node, { id: 'node-3' })
        flow.link(node1.id, 'a', node2.id, 'a')
        flow.link(node1.id, 'a', node3.id, 'a')
        flow.link(node1.id, 'b', node2.id, 'b')
        flow.link(node1.id, 'b', node3.id, 'b')
        flow.unlink(node1.id)
        expect(node2.data).toStrictEqual({ a: undefined, b: undefined })
        expect(node3.data).toStrictEqual({ a: undefined, b: undefined })
      })

      it('should remove all links specified by the target id', async() => {
        using flow = createFlow()
        const node1 = await flow.add(node, { id: 'node-1' })
        const node2 = await flow.add(node, { id: 'node-2' })
        const node3 = await flow.add(node, { id: 'node-3' })
        flow.link(node1.id, 'a', node2.id, 'a')
        flow.link(node1.id, 'a', node3.id, 'a')
        flow.link(node1.id, 'b', node2.id, 'b')
        flow.link(node1.id, 'b', node3.id, 'b')
        flow.unlink(undefined, undefined, node2.id)
        expect(node2.data).toStrictEqual({ a: undefined, b: undefined })
        expect(node3.data).toStrictEqual({ a: '$NODE.node-1:a', b: '$NODE.node-1:b' })
      })
    })

    describe('iterable', () => {
      const node = defineNode({
        kind: 'boolean',
        dataSchema: {
          a: { type: typeNumber, control: 'socket', isIterable: true },
          b: { type: typeNumber, control: 'socket', isIterable: true },
        },
        resultSchema: {
          a: { type: typeNumber },
          b: { type: typeNumber },
        },
      })

      it('should remove a link specified by source and target ids and keys', async() => {
        using flow = createFlow()
        const node1 = await flow.add(node, { id: 'node-1' })
        const node2 = await flow.add(node, { id: 'node-2' })
        const node3 = await flow.add(node, { id: 'node-3' })
        flow.link(node1.id, 'a', node2.id, 'a')
        flow.link(node1.id, 'a', node3.id, 'a')
        flow.link(node1.id, 'a', node2.id, 'b')
        flow.link(node1.id, 'a', node3.id, 'b')
        flow.link(node1.id, 'b', node2.id, 'a')
        flow.link(node1.id, 'b', node3.id, 'a')
        flow.link(node1.id, 'b', node2.id, 'b')
        flow.link(node1.id, 'b', node3.id, 'b')
        flow.unlink(node1.id, 'b', node2.id, 'b')
        expect(node2.data).toStrictEqual({
          a: ['$NODE.node-1:a', '$NODE.node-1:b'],
          b: ['$NODE.node-1:a'],
        })
        expect(node3.data).toStrictEqual({
          a: ['$NODE.node-1:a', '$NODE.node-1:b'],
          b: ['$NODE.node-1:a', '$NODE.node-1:b'],
        })
      })

      it('should remove links specified by the source and target ids', async() => {
        using flow = createFlow()
        const node1 = await flow.add(node, { id: 'node-1' })
        const node2 = await flow.add(node, { id: 'node-2' })
        const node3 = await flow.add(node, { id: 'node-3' })
        flow.link(node1.id, 'a', node2.id, 'a')
        flow.link(node1.id, 'a', node3.id, 'a')
        flow.link(node1.id, 'a', node2.id, 'b')
        flow.link(node1.id, 'a', node3.id, 'b')
        flow.link(node1.id, 'b', node2.id, 'a')
        flow.link(node1.id, 'b', node3.id, 'a')
        flow.link(node1.id, 'b', node2.id, 'b')
        flow.link(node1.id, 'b', node3.id, 'b')
        flow.unlink(node1.id, undefined, node2.id)
        expect(node2.data).toStrictEqual({
          a: [],
          b: [],
        })
        expect(node3.data).toStrictEqual({
          a: ['$NODE.node-1:a', '$NODE.node-1:b'],
          b: ['$NODE.node-1:a', '$NODE.node-1:b'],
        })
      })

      it('should remove links specified by the source id and key', async() => {
        using flow = createFlow()
        const node1 = await flow.add(node, { id: 'node-1' })
        const node2 = await flow.add(node, { id: 'node-2' })
        const node3 = await flow.add(node, { id: 'node-3' })
        flow.link(node1.id, 'a', node2.id, 'a')
        flow.link(node1.id, 'a', node3.id, 'a')
        flow.link(node1.id, 'a', node2.id, 'b')
        flow.link(node1.id, 'a', node3.id, 'b')
        flow.link(node1.id, 'b', node2.id, 'a')
        flow.link(node1.id, 'b', node3.id, 'a')
        flow.link(node1.id, 'b', node2.id, 'b')
        flow.link(node1.id, 'b', node3.id, 'b')
        flow.unlink(node1.id, 'a')
        expect(node2.data).toStrictEqual({
          a: ['$NODE.node-1:b'],
          b: ['$NODE.node-1:b'],
        })
        expect(node3.data).toStrictEqual({
          a: ['$NODE.node-1:b'],
          b: ['$NODE.node-1:b'],
        })
      })

      it('should remove links specified by the target id and key', async() => {
        using flow = createFlow()
        const node1 = await flow.add(node, { id: 'node-1' })
        const node2 = await flow.add(node, { id: 'node-2' })
        const node3 = await flow.add(node, { id: 'node-3' })
        flow.link(node1.id, 'a', node2.id, 'a')
        flow.link(node1.id, 'a', node3.id, 'a')
        flow.link(node1.id, 'a', node2.id, 'b')
        flow.link(node1.id, 'a', node3.id, 'b')
        flow.link(node1.id, 'b', node2.id, 'a')
        flow.link(node1.id, 'b', node3.id, 'a')
        flow.link(node1.id, 'b', node2.id, 'b')
        flow.link(node1.id, 'b', node3.id, 'b')
        flow.unlink(undefined, undefined, node2.id, 'b')
        expect(node2.data).toStrictEqual({
          a: ['$NODE.node-1:a', '$NODE.node-1:b'],
          b: [],
        })
        expect(node3.data).toStrictEqual({
          a: ['$NODE.node-1:a', '$NODE.node-1:b'],
          b: ['$NODE.node-1:a', '$NODE.node-1:b'],
        })
      })

      it('should remove all links specified by the source id', async() => {
        using flow = createFlow()
        const node1 = await flow.add(node, { id: 'node1' })
        const node2 = await flow.add(node, { id: 'node2' })
        const node3 = await flow.add(node, { id: 'node3' })
        flow.link(node1.id, 'a', node2.id, 'a')
        flow.link(node1.id, 'a', node3.id, 'a')
        flow.link(node1.id, 'a', node2.id, 'b')
        flow.link(node1.id, 'a', node3.id, 'b')
        flow.link(node1.id, 'b', node2.id, 'a')
        flow.link(node1.id, 'b', node3.id, 'a')
        flow.link(node1.id, 'b', node2.id, 'b')
        flow.link(node1.id, 'b', node3.id, 'b')
        flow.unlink(node1.id)
        expect(node2.data).toStrictEqual({
          a: [],
          b: [],
        })
        expect(node3.data).toStrictEqual({
          a: [],
          b: [],
        })
      })

      it('should remove all links specified by the target id', async() => {
        using flow = createFlow()
        const node1 = await flow.add(node, { id: 'node1' })
        const node2 = await flow.add(node, { id: 'node2' })
        const node3 = await flow.add(node, { id: 'node3' })
        flow.link(node1.id, 'a', node2.id, 'a')
        flow.link(node1.id, 'a', node3.id, 'a')
        flow.link(node1.id, 'a', node2.id, 'b')
        flow.link(node1.id, 'a', node3.id, 'b')
        flow.link(node1.id, 'b', node2.id, 'a')
        flow.link(node1.id, 'b', node3.id, 'a')
        flow.link(node1.id, 'b', node2.id, 'b')
        flow.link(node1.id, 'b', node3.id, 'b')
        flow.unlink(undefined, undefined, node2.id)
        expect(node2.data).toStrictEqual({
          a: [],
          b: [],
        })
        expect(node3.data).toStrictEqual({
          a: ['$NODE.node1:a', '$NODE.node1:b'],
          b: ['$NODE.node1:a', '$NODE.node1:b'],
        })
      })
    })
  })

  describe('start', () => {
    describe('lifecycle', () => {
      it('should set the `isRunning` property to true when the flow is started', () => {
        using flow = createFlow()
        void flow.start()
        expect(flow.isRunning).toBe(true)
      })

      it('should set the `isRunning` property to false when the flow is finished', async() => {
        using flow = createFlow()
        await flow.start()
        expect(flow.isRunning).toBe(false)
      })

      it('should dispatch a "flow:start" event when the flow is started', () => {
        using flow = createFlow()
        const listener = vi.fn()
        flow.on('flow:start', listener)
        void flow.start()
        expect(listener).toHaveBeenCalledOnce()
      })

      it('should dispatch a "flow:end" event when the flow is finished', async() => {
        using flow = createFlow()
        const listener = vi.fn()
        flow.on('flow:end', listener)
        await flow.start()
        expect(listener).toHaveBeenCalledOnce()
      })

      it('should reject if the flow is already running', async() => {
        using flow = createFlow()
        void flow.start()
        const shouldReject = flow.start()
        await expect(shouldReject).rejects.toThrow('The flow is already running')
      })

      it('should reject if the flow has been destroyed', async() => {
        using flow = createFlow()
        flow.destroy()
        const shouldReject = flow.start()
        await expect(shouldReject).rejects.toThrow('The flow has been destroyed')
      })

      it('should set the `threadId` property to a random UUID when the flow is started', () => {
        using flow = createFlow()
        void flow.start()
        expect(flow.threadId).toMatch(EXP_UUID)
      })

      it('should set the `threadId` property to a random UUID when the flow is started multiple times', async() => {
        using flow = createFlow()
        await flow.start()
        const threadId = flow.threadId
        void flow.start()
        expect(flow.threadId).not.toBe(threadId)
        expect(flow.threadId).toMatch(EXP_UUID)
      })
    })

    describe('input', () => {
      const nodeInput = defineNode({
        kind: NODE_INPUT_KIND,
        dataSchema: { name: { type: typeString } },
        resultSchema: { value: { type: typeString } },
        process: ({ result }) => result,
      })

      it('should set the `result` of the input nodes', async() => {
        using flow = createFlow()
        const node = await flow.add(nodeInput, { initialData: { name: 'message' } })
        await flow.start({ message: 'Hello, World!' })
        expect(node.result).toStrictEqual({ value: 'Hello, World!' })
      })

      it('should set the `input` property to an empty object by default', () => {
        using flow = createFlow()
        void flow.start()
        expect(flow.input).toStrictEqual({})
      })

      it('should set the `input` property to the provided input object', () => {
        using flow = createFlow()
        void flow.start({ key: 'value' })
        expect(flow.input).toStrictEqual({ key: 'value' })
      })

      it('should emit the "flow:start" event with the input object', () => {
        using flow = createFlow()
        const listener = vi.fn()
        flow.on('flow:start', listener)
        void flow.start({ key: 'value' })
        expect(listener).toHaveBeenCalledWith(
          { key: 'value' },
          {
            threadId: flow.threadId,
            timestamp: Date.now(),
            delta: expect.any(Number),
          },
        )
      })
    })

    describe('output', () => {
      const nodeOutput = defineNode({
        kind: NODE_OUTPUT_KIND,
        dataSchema: {
          name: { type: typeString },
          value: { type: typeString },
        },
      })

      it('should set the output of the flow to the output object', async() => {
        using flow = createFlow()
        await flow.add(nodeOutput, { initialData: { name: 'message', value: 'Hello, World!' } })
        await flow.start()
        expect(flow.output).toStrictEqual({ message: 'Hello, World!' })
      })

      it('should set the output of the flow to the output object with multiple nodes', async() => {
        using flow = createFlow()
        await flow.add(nodeOutput, { initialData: { name: 'message1', value: 'Hello, World!' } })
        await flow.add(nodeOutput, { initialData: { name: 'message2', value: 'Hello, Universe!' } })
        await flow.start()
        expect(flow.output).toStrictEqual({
          message1: 'Hello, World!',
          message2: 'Hello, Universe!',
        })
      })

      it('should emit the "flow:end" event with the output object', async() => {
        using flow = createFlow()
        const listener = vi.fn()
        flow.on('flow:end', listener)
        await flow.add(nodeOutput, { initialData: { name: 'message', value: 'Hello, World!' } })
        await flow.start()
        expect(listener).toHaveBeenCalledWith(
          { message: 'Hello, World!' },
          { threadId: flow.threadId, timestamp: Date.now(), delta: expect.any(Number) },
        )
      })
    })
  })
})
