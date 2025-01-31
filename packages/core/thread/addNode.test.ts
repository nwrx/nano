import { defineComponent, ERRORS } from '../utils'
import { addNode } from './addNode'
import { createThread } from './createThread'

describe('addNode', () => {
  describe('addNode', () => {
    it('should add a component instance and parse the specifier', () => {
      const thread = createThread()
      const id = addNode(thread, 'example.com:custom/my-component@1')
      const threadInstance = thread.nodes.get(id)
      expect(threadInstance).toMatchObject({
        tag: '1',
        collection: 'custom',
        registry: 'example.com',
        name: 'my-component',
      })
    })

    it('should add a component instance with input', () => {
      const thread = createThread()
      const id = addNode(thread, 'core/input', { input: { message: 'Hello, world!' } })
      const threadInstance = thread.nodes.get(id)
      expect(threadInstance).toMatchObject({
        input: { message: 'Hello, world!' },
      })
    })

    it('should add a component instance with metadata', () => {
      const thread = createThread()
      const id = addNode(thread, 'core/input', { metadata: { label: 'Input' } })
      const threadInstance = thread.nodes.get(id)
      expect(threadInstance).toMatchObject({
        metadata: { label: 'Input' },
      })
    })

    it('should add a component instance with a component', () => {
      const thread = createThread()
      const component = defineComponent({})
      const id = addNode(thread, 'core/input', { component })
      const threadInstance = thread.nodes.get(id)
      expect(threadInstance).toMatchObject({ component })
    })
  })

  describe('id', () => {
    it('should generate a unique ID if not provided', () => {
      const thread = createThread()
      const id = addNode(thread, 'example')
      expect(id).toMatch(/^[\da-z]+$/)
    })

    it('should throw an error if the ID already exists', () => {
      const thread = createThread()
      addNode(thread, 'example', { id: 'id' })
      const shouldThrow = () => addNode(thread, 'example', { id: 'id' })
      const error = ERRORS.NODE_DUPLICATE_ID('id')
      expect(shouldThrow).toThrow(error)
    })

    it('should use the provided ID if given', () => {
      const thread = createThread()
      const id = addNode(thread, 'example', { id: 'custom-id' })
      const threadInstance = thread.nodes.get(id)
      expect(id).toBe('custom-id')
      expect(threadInstance).toBeDefined()
    })
  })
})
