import type { ObjectLike } from '@unshared/types'
import { addNode, createThread, getNodeComponent } from '../thread'
import { start } from '../thread'
import { createReference, ERRORS as E } from '../utils'
import { parse } from './parse'

async function fixture(input: ObjectLike) {
  const thread = createThread()
  const id = addNode(thread, 'parse', { id: 'node-id', input, component: parse })
  addNode(thread, 'output', { input: { name: 'object', value: createReference('Nodes', id, 'object') } })
  const result = await start(thread)
  return result.object
}

describe('parse component', () => {
  describe('parse', () => {
    it('should parse a JSON string into an object', async() => {
      const result = await fixture({ format: 'json', value: '{"name":"John","age":42}' })
      expect(result).toStrictEqual({ name: 'John', age: 42 })
    })

    it('should parse a YAML string into an object', async() => {
      const result = await fixture({ format: 'yaml', value: 'name: John\nage: 42\n' })
      expect(result).toStrictEqual({ name: 'John', age: 42 })
    })

    it('should handle an empty object', async() => {
      const result = await fixture({ format: 'json', value: '{}' })
      expect(result).toStrictEqual({})
    })

    it('should handle nested objects', async() => {
      const result = await fixture({ format: 'yaml', value: 'person:\n  name: John\n  age: 42\n' })
      expect(result).toStrictEqual({ person: { name: 'John', age: 42 } })
    })
  })

  describe('default values', () => {
    it('should parse a JSON string by default', async() => {
      const result = await fixture({ value: '{"name":"John","age":42}' })
      expect(result).toStrictEqual({ name: 'John', age: 42 })
    })

    it('should parse an empty object by default', async() => {
      const result = await fixture({})
      expect(result).toStrictEqual({})
    })
  })

  describe('schema validation', () => {
    it('should throw if the format is not supported', async() => {
      const shouldThrow = fixture({ format: 'unknown', value: '{}' })
      const error = E.NODE_INPUT_SCHEMA_MISMATCH('node-id', {
        format: E.INPUT_NOT_ONE_OF('format', [
          E.INPUT_NOT_IN_ENUM('format', ['json']),
          E.INPUT_NOT_IN_ENUM('format', ['yaml']),
        ]),
      })
      await expect(shouldThrow).rejects.toThrow(error)
    })

    it('should throw if the value is not a string', async() => {
      const shouldThrow = fixture({ format: 'json', value: { name: 'John', age: 42 } })
      const error = E.NODE_INPUT_SCHEMA_MISMATCH('node-id', {
        value: E.INPUT_NOT_STRING('value'),
      })
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
