/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { defineComponent } from '.'
import { addNode, createThread } from '../thread'
import { DEFAULT_REFERENCE_RESOLVER } from './defaultReferenceResolver'

describe('DEFAULT_REFERENCE_RESOLVER', () => {
  describe('Nodes', () => {
    it('should resolve a reference to the result of a node', async() => {
      const thread = createThread()
      const id = addNode(thread, 'example')
      const node = thread.nodes.get(id)!
      node.result.output = 'test-result'
      const result = await DEFAULT_REFERENCE_RESOLVER.call(thread, 'Nodes', id, 'output')
      expect(result).toBe('test-result')
    })

    it('should return undefined if the result is undefined', async() => {
      const thread = createThread()
      const id = addNode(thread, 'example')
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
        schema: {
          type: 'object',
          required: ['valueRequired'],
          properties: {
            valueOptional: {
              'type': 'string',
              'x-optional': true,
            },
            valueRequired: {
              type: 'object',
              properties: { key: { type: 'string' } },
            },
          },
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
