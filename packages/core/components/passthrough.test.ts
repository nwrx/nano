import type { ObjectLike } from '@unshared/types'
import { addNode, createThread, getNodeComponent } from '../thread'
import { start } from '../thread'
import { createReference, ERRORS } from '../utils'
import { passthrough } from './passthrough'

async function fixture(input: ObjectLike) {
  const thread = createThread()
  const id = addNode(thread, 'passthrough', { id: 'node-id', input, component: passthrough })
  addNode(thread, 'output', { input: { name: 'value', value: createReference('Nodes', id, 'value') } })
  const result = await start(thread)
  return result.value
}

describe('passthrough', () => {
  describe('passthrough', () => {
    it('should passthrough strings', async() => {
      const result = await fixture({ value: 'test' })
      expect(result).toStrictEqual('test')
    })

    it('should passthrough numbers', async() => {
      const result = await fixture({ value: 42 })
      expect(result).toStrictEqual(42)
    })

    it('should passthrough booleans', async() => {
      const result = await fixture({ value: { name: 'John', age: 42 } })
      expect(result).toStrictEqual({ name: 'John', age: 42 })
    })

    it('should passthrough arrays', async() => {
      const result = await fixture({ value: [1, 2, 3] })
      expect(result).toStrictEqual([1, 2, 3])
    })

    it('should passthrough objects', async() => {
      const result = await fixture({ value: { name: 'John', age: 42 } })
      expect(result).toStrictEqual({ name: 'John', age: 42 })
    })
  })

  describe('schema validation', () => {
    it('should throw if the value is missing', async() => {
      const shouldReject = fixture({})
      const error = ERRORS.NODE_INPUT_SCHEMA_MISMATCH('node-id', {
        value: ERRORS.INPUT_REQUIRED('value'),
      })
      await expect(shouldReject).rejects.toThrow(error)
    })
  })

  describe('native component', () => {
    it('should be included in the native components', async() => {
      const thread = createThread()
      const id = addNode(thread, 'passthrough')
      const component = await getNodeComponent(thread, id)
      expect(component).toStrictEqual(passthrough)
    })
  })
})
