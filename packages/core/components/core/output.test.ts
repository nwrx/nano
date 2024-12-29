import { addNode, createThread, getNodeComponent, startNode } from '../../thread'
import { output } from './output'

describe('output component', () => {
  describe('output', () => {
    it('should set the output string in the thread', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'output', { input: { name: 'result', value: 'test' } })
      await startNode(thread, nodeId)
      expect(thread.output).toStrictEqual({ result: 'test' })
    })

    it('should set the output number in the thread', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'output', { input: { name: 'result', value: 42 } })
      await startNode(thread, nodeId)
      expect(thread.output).toStrictEqual({ result: 42 })
    })

    it('should set the output boolean in the thread', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'output', { input: { name: 'result', value: true } })
      await startNode(thread, nodeId)
      expect(thread.output).toStrictEqual({ result: true })
    })

    it('should set the output object in the thread', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'output', { input: { name: 'result', value: { key: 'value' } } })
      await startNode(thread, nodeId)
      expect(thread.output).toStrictEqual({ result: { key: 'value' } })
    })

    it('should set the output array in the thread', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'output', { input: { name: 'result', value: [1, 2, 3] } })
      await startNode(thread, nodeId)
      expect(thread.output).toStrictEqual({ result: [1, 2, 3] })
    })

    it('should set the output stream in the thread', async() => {
      const stream = new ReadableStream()
      const thread = createThread()
      const nodeId = addNode(thread, 'output', { input: { name: 'result', value: stream } })
      await startNode(thread, nodeId)
      expect(thread.output).toStrictEqual({ result: stream })
    })

    it('should set the output file in the thread', async() => {
      const file = new File([''], 'example.txt')
      const thread = createThread()
      const nodeId = addNode(thread, 'output', { input: { name: 'result', value: file } })
      await startNode(thread, nodeId)
      expect(thread.output).toStrictEqual({ result: file })
    })

    it('should dispatch the "output" event with the correct value', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'output', { input: { name: 'result', value: 'test' } })
      const callback = vi.fn()
      thread.on('nodeOutput', callback)
      await startNode(thread, nodeId)
      expect(callback).toHaveBeenCalledOnce()
      expect(callback).toHaveBeenCalledWith(nodeId, 'result', 'test')
    })
  })

  describe('schema validation', () => {
    it('should throw if the name is missing', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'output', { input: { value: 'test' } })
      const shouldReject = startNode(thread, nodeId)
      await expect(shouldReject).rejects.toThrow()
    })

    it('should throw if the value is missing', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'output', { input: { name: 'result' } })
      const shouldReject = startNode(thread, nodeId)
      await expect(shouldReject).rejects.toThrow()
    })
  })

  describe('native component', () => {
    it('should be included in the native components', async() => {
      const thread = createThread()
      const id = addNode(thread, 'output')
      const component = await getNodeComponent(thread, id)
      expect(component).toStrictEqual(output)
    })
  })
})
