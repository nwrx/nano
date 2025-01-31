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
      const id = addNode(thread, 'example', { component })
      const node = thread.nodes.get(id)!
      node.result = { output: 'test-result' }
      const result = await DEFAULT_REFERENCE_RESOLVER.call(thread, 'Nodes', id, 'output')
      expect(result).toBe('test-result')
    })

    it('should throw if the node is not found', async() => {
      const thread = createThread()
      const shouldReject = DEFAULT_REFERENCE_RESOLVER.call(thread, 'Nodes', 'invalid-id', 'output')
      const error = E.NODE_NOT_FOUND('invalid-id')
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw if the node output socket does not exist', async() => {
      const thread = createThread()
      const id = addNode(thread, 'example', { component })
      const shouldReject = DEFAULT_REFERENCE_RESOLVER.call(thread, 'Nodes', id, 'invalid-socket')
      const error = E.NODE_OUTPUT_SOCKET_NOT_FOUND(id, 'invalid-socket')
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should return undefined if the result is undefined', async() => {
      const thread = createThread()
      const id = addNode(thread, 'example', { component })
      const result = await DEFAULT_REFERENCE_RESOLVER.call(thread, 'Nodes', id, 'output')
      expect(result).toBeUndefined()
    })
  })

  describe('Tools', () => {
    const component = defineComponent({
      inputs: {
        valueOptional: {
          'type': 'string',
          'x-optional': true,
        },
        valueRequired: {
          type: 'object',
          properties: {
            key: { type: 'string' },
          },
        },
      },
      outputs: {
        result: {
          type: 'string',
        },
      },
    }, () => ({ result: 'test-result' }))

    it('should resolve a reference to a tool', async() => {
      const thread = createThread()
      const id = addNode(thread, 'example', { component })
      const result = await DEFAULT_REFERENCE_RESOLVER.call(thread, 'Tools', id)
      expect(result).toStrictEqual({
        call: expect.any(Function),
        description: '',
        name: 'core/example',
        parameters: {
          properties: {
            __toolMessage: {
              type: 'string',
              description: expect.any(String),
            },
            __toolName: {
              type: 'string',
              description: expect.any(String),
            },
            valueOptional: {
              'type': 'string',
              'x-optional': true,
            },
            valueRequired: {
              type: 'object',
              properties: { key: { type: 'string' } },
            },
          },
          required: [
            'valueRequired',
          ],
          type: 'object',
        },
      })
    })

    it('should return undefined if the component\'s inputs are undefined', async() => {
      const thread = createThread()
      const id = addNode(thread, 'example', { component: { ...component, inputs: undefined } })
      const result = await DEFAULT_REFERENCE_RESOLVER.call(thread, 'Tools', id)
      expect(result).toBeUndefined()
    })

    it('should return undefined if the component\'s process is undefined', async() => {
      const thread = createThread()
      const id = addNode(thread, 'example', { component: { ...component, process: undefined } })
      const result = await DEFAULT_REFERENCE_RESOLVER.call(thread, 'Tools', id)
      expect(result).toBeUndefined()
    })
  })
})
