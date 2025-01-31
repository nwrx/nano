import { addNode, createThread, getNodeComponent, startNode } from '../../thread'
import { ERRORS } from '../../utils'
import { passthrough } from './passthrough'

describe('passthrough', () => {
  describe('passthrough', () => {
    it('should passthrough strings', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'passthrough', { id: 'node-id', input: { value: 'test' }, component: passthrough })
      const result = await startNode(thread, nodeId)
      expect(result).toStrictEqual({ value: 'test' })
    })

    it('should passthrough numbers', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'passthrough', { id: 'node-id', input: { value: 42 }, component: passthrough })
      const result = await startNode(thread, nodeId)
      expect(result).toStrictEqual({ value: 42 })
    })

    it('should passthrough booleans', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'passthrough', { id: 'node-id', input: { value: { name: 'John', age: 42 } }, component: passthrough })
      const result = await startNode(thread, nodeId)
      expect(result).toStrictEqual({ value: { name: 'John', age: 42 } })
    })

    it('should passthrough arrays', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'passthrough', { id: 'node-id', input: { value: [1, 2, 3] }, component: passthrough })
      const result = await startNode(thread, nodeId)
      expect(result).toStrictEqual({ value: [1, 2, 3] })
    })

    it('should passthrough objects', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'passthrough', { id: 'node-id', input: { value: { name: 'John', age: 42 } }, component: passthrough })
      const result = await startNode(thread, nodeId)
      expect(result).toStrictEqual({ value: { name: 'John', age: 42 } })
    })
  })

  describe('schema validation', () => {
    it('should throw if the value is missing', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'passthrough', { id: 'node-id', component: passthrough })
      const shouldReject = startNode(thread, nodeId)
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
