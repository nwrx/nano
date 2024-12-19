import type { ObjectLike } from '@unshared/types'
import { addNode, createThread, getNodeComponent } from '../thread'
import { start } from '../thread'
import { createReference, ERRORS as E } from '../utils'
import { stringify } from './stringify'

async function fixture(input: ObjectLike) {
  const thread = createThread()
  const id = addNode(thread, 'stringify', { id: 'node-id', input, component: stringify })
  addNode(thread, 'output', { input: { name: 'value', value: createReference('Nodes', id, 'value') } })
  const result = await start(thread)
  return result.value
}

describe('stringify component', () => {
  describe('JSON format', () => {
    it('should serialize an object to a JSON string', async() => {
      const result = await fixture({ format: 'json', object: { name: 'John', age: 42 } })
      expect(result).toStrictEqual(JSON.stringify({ name: 'John', age: 42 }, undefined, 2))
    })

    it('should serialize an object to a JSON string by default', async() => {
      const result = await fixture({ object: { name: 'John', age: 42 } })
      expect(result).toStrictEqual(JSON.stringify({ name: 'John', age: 42 }, undefined, 2))
    })
  })

  describe('YAML format', () => {
    it('should serialize an object to a YAML string', async() => {
      const result = await fixture({ format: 'yaml', object: { name: 'John', age: 42 } })
      expect(result).toStrictEqual('name: John\nage: 42\n')
    })
  })

  describe('edge cases', () => {
    it('should handle an empty object', async() => {
      const result = await fixture({ format: 'json', object: {} })
      expect(result).toStrictEqual('{}')
    })

    it('should handle nested objects', async() => {
      const result = await fixture({ format: 'yaml', object: { person: { name: 'John', age: 42 } } })
      expect(result).toStrictEqual('person:\n  name: John\n  age: 42\n')
    })
  })

  describe('schema validation', () => {
    it('should throw if the format is not supported', async() => {
      const shouldThrow = fixture({ format: 'unknown', object: {} })
      const error = E.NODE_INPUT_SCHEMA_MISMATCH('node-id', {
        format: E.INPUT_NOT_ONE_OF('format', [
          E.INPUT_NOT_IN_ENUM('format', ['json']),
          E.INPUT_NOT_IN_ENUM('format', ['yaml']),
        ]),
      })
      await expect(shouldThrow).rejects.toThrow(error)
    })

    it('should throw if the object is not an object', async() => {
      const shouldThrow = fixture({ format: 'json', object: 'not an object' })
      const error = E.NODE_INPUT_SCHEMA_MISMATCH('node-id', {
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
