import { addNode, createThread, getNodeComponent, startNode } from '../../thread'
import { input } from './input'

describe('input component', () => {
  describe('basic functionality', () => {
    it('should return the provided input value', async() => {
      const thread = createThread()
      thread.input = { name: 'John' }
      const nodeId = addNode(thread, 'input', { input: { name: 'name' } })
      const result = await startNode(thread, nodeId)
      expect(result).toStrictEqual({ value: 'John' })
    })

    it('should throw an error if the required input is not provided', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'input', { input: { name: 'name', required: true } })
      const shouldThrow = startNode(thread, nodeId)
      const error = new Error('Input "name" is required but not provided.')
      await expect(shouldThrow).rejects.toThrow(error)
    })

    it('should return undefined if the optional input is not provided', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'input', { input: { name: 'name', required: false } })
      const result = await startNode(thread, nodeId)
      expect(result).toStrictEqual({ value: undefined })
    })
  })

  describe('edge cases', () => {
    it('should throw an error if the input is a stream', async() => {
      const thread = createThread()
      const stream = new ReadableStream()
      const nodeId = addNode(thread, 'input', { input: { name: 'name', required: true } })
      thread.input.name = stream
      const shouldThrow = startNode(thread, nodeId)
      const error = new Error('Input "name" is a stream and cannot be used as an input.')
      await expect(shouldThrow).rejects.toThrow(error)
    })

    it('should throw an error if the input is a file', async() => {
      const thread = createThread()
      const file = new File([], 'file.txt')
      const nodeId = addNode(thread, 'input', { input: { name: 'name', required: true } })
      thread.input.name = file
      const shouldThrow = startNode(thread, nodeId)
      const error = new Error('Input "name" is a file and cannot be used as an input\'')
      await expect(shouldThrow).rejects.toThrow(error)
    })
  })

  describe('native component', () => {
    it('should be included in the native components', async() => {
      const thread = createThread()
      const id = addNode(thread, 'input')
      const component = await getNodeComponent(thread, id)
      expect(component).toStrictEqual(input)
    })
  })
})
