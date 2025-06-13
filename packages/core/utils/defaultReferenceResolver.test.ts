/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { addNode, createThread } from '../thread'
import { DEFAULT_REFERENCE_RESOLVER } from './defaultReferenceResolver'
import { defineComponent } from './defineComponent'
import { ERRORS as E } from './errors'

describe('DEFAULT_REFERENCE_RESOLVER', () => {
  describe('Nodes', () => {
    const component = defineComponent({
      inputs: { value: { type: 'string' } },
      outputs: { output: { type: 'string' } },
    })

    it('should resolve a reference to the result of a node', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'example', { component })
      const node = thread.nodes.get(nodeId)!
      node.state = 'done'
      node.result = { output: 'test-result' }
      const result = await DEFAULT_REFERENCE_RESOLVER.call(thread, 'Nodes', nodeId, 'output')
      expect(result).toBe('test-result')
    })

    it('should return null if the result is undefined', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'example', { component })
      const node = thread.nodes.get(nodeId)!
      node.state = 'done'
      const result = await DEFAULT_REFERENCE_RESOLVER.call(thread, 'Nodes', nodeId, 'output')
      expect(result).toBeNull()
    })

    it('should throw if the node is not found', async() => {
      const thread = createThread()
      const shouldReject = DEFAULT_REFERENCE_RESOLVER.call(thread, 'Nodes', 'invalid-id', 'output')
      const error = E.NODE_NOT_FOUND('invalid-id')
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw if the node output socket does not exist', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'example', { component })
      const node = thread.nodes.get(nodeId)!
      node.state = 'done'
      const shouldReject = DEFAULT_REFERENCE_RESOLVER.call(thread, 'Nodes', nodeId, 'invalid-socket')
      const error = E.NODE_OUTPUT_SOCKET_NOT_FOUND(nodeId, 'invalid-socket')
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw if the node is not done', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'example', { component })
      const shouldReject = DEFAULT_REFERENCE_RESOLVER.call(thread, 'Nodes', nodeId, 'output')
      const error = E.REFERENCE_TO_PENDING_NODE(nodeId)
      await expect(shouldReject).rejects.toThrow(error)
    })
  })

  describe('Tools', () => {
    it('should resolve a reference to a tool', async() => {
      const thread = createThread()
      const component = defineComponent({}, () => ({ result: 'Hello, World!' }))
      const nodeId = addNode(thread, 'example', { component })
      const result = await DEFAULT_REFERENCE_RESOLVER.call(thread, 'Nodes', nodeId)
      expect(result).toStrictEqual({
        call: expect.any(Function),
        name: 'example',
        nodeId,
        description: undefined,
        inputSchema: expect.any(Object),
      })
    })

    it('should use the title as the metadata comment if provided', async() => {
      const thread = createThread()
      const component = defineComponent({}, () => ({ result: 'Hello, World!' }))
      const nodeId = addNode(thread, 'example', { component, metadata: { comment: 'Tool Description' } })
      const result = await DEFAULT_REFERENCE_RESOLVER.call(thread, 'Nodes', nodeId)
      expect(result).toStrictEqual({
        call: expect.any(Function),
        name: 'example',
        nodeId,
        description: 'Tool Description',
        inputSchema: expect.any(Object),
      })
    })

    it('should throw an error of the node component does not have a call function', async() => {
      const thread = createThread()
      const component = defineComponent({})
      const nodeId = addNode(thread, 'example', { component })
      const shouldReject = DEFAULT_REFERENCE_RESOLVER.call(thread, 'Nodes', nodeId)
      const error = E.REFERENCE_TO_TOOL_BUT_NO_PROCESS_FUNCTION(nodeId)
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw an error if the node is not found', async() => {
      const thread = createThread()
      const shouldReject = DEFAULT_REFERENCE_RESOLVER.call(thread, 'Nodes', 'invalid-id')
      const error = E.NODE_NOT_FOUND('invalid-id')
      await expect(shouldReject).rejects.toThrow(error)
    })
  })
})
