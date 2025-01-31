import { addNode, createThread, getNodeComponent, startNode } from '../../thread'
import { ERRORS as E } from '../../utils'
import { parse } from './parse'

describe('parse component', () => {
  describe('parse', () => {
    it('should parse a JSON string into an object', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'parse', { component: parse })
      const result = await startNode(thread, nodeId, { format: 'json', value: '{"name":"John","age":42}' })
      expect(result).toStrictEqual({ object: { name: 'John', age: 42 } })
    })

    it('should parse a YAML string into an object', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'parse', { component: parse })
      const result = await startNode(thread, nodeId, { format: 'yaml', value: 'name: John\nage: 42\n' })
      expect(result).toStrictEqual({ object: { name: 'John', age: 42 } })
    })
  })

  describe('default values', () => {
    it('should parse a JSON string by default', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'parse', { component: parse })
      const result = await startNode(thread, nodeId, { value: '{"name":"John","age":42}' })
      expect(result).toStrictEqual({ object: { name: 'John', age: 42 } })
    })

    it('should parse an empty object by default', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'parse', { component: parse })
      const result = await startNode(thread, nodeId)
      expect(result).toStrictEqual({ object: {} })
    })
  })

  describe('schema validation', () => {
    it('should throw if the format is not supported', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'parse', { input: { format: 'unknown', value: '{}' }, component: parse })
      const shouldThrow = startNode(thread, nodeId)
      const error = E.NODE_INPUT_SCHEMA_MISMATCH(nodeId, { format: E.INPUT_NOT_IN_ENUM('format', ['json', 'yaml']) })
      await expect(shouldThrow).rejects.toThrow(error)
    })

    it('should throw if the value is not a string', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'parse', { input: { format: 'json', value: { name: 'John', age: 42 } }, component: parse })
      const shouldThrow = startNode(thread, nodeId)
      const error = E.NODE_INPUT_SCHEMA_MISMATCH(nodeId, { value: E.INPUT_NOT_STRING('value') })
      await expect(shouldThrow).rejects.toThrow(error)
    })
  })

  describe('native component', () => {
    it('should be included in the native components', async() => {
      const thread = createThread()
      const id = addNode(thread, 'parse')
      const component = await getNodeComponent(thread, id)
      expect(component).toStrictEqual(parse)
    })
  })
})
