import { addNode, createThread, getNodeComponent, startNode } from '../../thread'
import { ERRORS as E } from '../../utils'
import { stringify } from './stringify'

describe('stringify component', () => {
  describe('JSON format', () => {
    it('should serialize an object to a JSON string', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'stringify', { input: { format: 'json', object: { name: 'John', age: 42 } }, component: stringify })
      const result = await startNode(thread, nodeId)
      expect(result).toStrictEqual({ value: '{\n  "name": "John",\n  "age": 42\n}' })
    })

    it('should serialize an object to a JSON string by default', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'stringify', { input: { object: { name: 'John', age: 42 } }, component: stringify })
      const result = await startNode(thread, nodeId)
      expect(result).toStrictEqual({ value: '{\n  "name": "John",\n  "age": 42\n}' })
    })
  })

  describe('YAML format', () => {
    it('should serialize an object to a YAML string', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'stringify', { input: { format: 'yaml', object: { name: 'John', age: 42 } }, component: stringify })
      const result = await startNode(thread, nodeId)
      expect(result).toStrictEqual({ value: 'name: John\nage: 42\n' })
    })

    it('should handle an empty object', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'stringify', { input: { format: 'json', object: {} }, component: stringify })
      const result = await startNode(thread, nodeId)
      expect(result).toStrictEqual({ value: '{}' })
    })
  })

  describe('schema validation', () => {
    it('should throw if the format is not supported', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'stringify', { input: { format: 'unknown', object: {} }, component: stringify })
      const shouldThrow = startNode(thread, nodeId)
      const error = E.NODE_INPUT_SCHEMA_MISMATCH(nodeId, {
        format: E.INPUT_NOT_IN_ENUM('format', ['json', 'yaml']),
      })
      await expect(shouldThrow).rejects.toThrow(error)
    })

    it('should throw if the object is not an object', async() => {
      // const shouldThrow = fixture({ format: 'json', object: 'not an object' })
      const thread = createThread()
      const nodeId = addNode(thread, 'stringify', { input: { format: 'json', object: 'not an object' }, component: stringify })
      const shouldThrow = startNode(thread, nodeId)
      const error = E.NODE_INPUT_SCHEMA_MISMATCH(nodeId, {
        object: E.INPUT_NOT_OBJECT('object'),
      })
      await expect(shouldThrow).rejects.toThrow(error)
    })
  })

  describe('native component', () => {
    it('should be included in the native components', async() => {
      const thread = createThread()
      const id = addNode(thread, 'stringify')
      const component = await getNodeComponent(thread, id)
      expect(component).toStrictEqual(stringify)
    })
  })
})
