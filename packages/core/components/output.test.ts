import { addNode, createThread, getNodeComponent, startNode } from '../../thread'
import { output } from './output'

function createStream(data: string | Uint8Array, chunkSize = 5) {
  const stream = new ReadableStream({
    start(controller) {
      let offset = 0
      function push() {
        if (offset >= data.length) {
          controller.close()
          return
        }
        controller.enqueue(data.slice(offset, offset + chunkSize))
        offset += chunkSize
        setTimeout(push, 10)
      }
      push()
    },
  })
  return stream
}

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

  describe('output stream', () => {
    it('should dispatch the "outputDeltaStart" event when the stream starts', async() => {
      const stream = createStream('Hello, World!')
      const thread = createThread()
      const nodeId = addNode(thread, 'output', { input: { name: 'result', value: stream } })
      const callback = vi.fn()
      thread.on('nodeOutputDeltaStart', callback)
      await startNode(thread, nodeId)
      expect(callback).toHaveBeenCalledOnce()
      expect(callback).toHaveBeenCalledWith(nodeId, 'result')
    })

    it('should dispatch the "outputDelta" event for each chunk', async() => {
      const stream = createStream('Hello, World!')
      const thread = createThread()
      const nodeId = addNode(thread, 'output', { input: { name: 'result', value: stream } })
      const callback = vi.fn()
      thread.on('nodeOutputDelta', callback)
      await startNode(thread, nodeId)
      expect(callback).toHaveBeenCalledTimes(3)
      expect(callback).toHaveBeenCalledWith(nodeId, 'result', 'Hello')
      expect(callback).toHaveBeenCalledWith(nodeId, 'result', ', Wor')
      expect(callback).toHaveBeenCalledWith(nodeId, 'result', 'ld!')
    })

    it('should dispatch the "outputDeltaEnd" event when the stream ends', async() => {
      const stream = createStream('Hello, World!')
      const thread = createThread()
      const nodeId = addNode(thread, 'output', { input: { name: 'result', value: stream } })
      const callback = vi.fn()
      thread.on('nodeOutputDeltaEnd', callback)
      await startNode(thread, nodeId)
      expect(callback).toHaveBeenCalledOnce()
      expect(callback).toHaveBeenCalledWith(nodeId, 'result')
    })

    it('should call the delta events in the correct order', async() => {
      const stream = createStream('Hello, World!')
      const thread = createThread()
      const nodeId = addNode(thread, 'output', { input: { name: 'result', value: stream } })
      const calls: string[] = []
      thread.on('nodeOutputDeltaStart', () => calls.push('start'))
      thread.on('nodeOutputDelta', () => calls.push('delta'))
      thread.on('nodeOutputDeltaEnd', () => calls.push('end'))
      await startNode(thread, nodeId)
      expect(calls).toStrictEqual(['start', 'delta', 'delta', 'delta', 'end'])
    })

    it('should set the output stream string in the thread', async() => {
      const stream = createStream('Hello, World!')
      const thread = createThread()
      const nodeId = addNode(thread, 'output', { input: { name: 'result', value: stream } })
      await startNode(thread, nodeId)
      expect(thread.output).toStrictEqual({ result: 'Hello, World!' })
    })

    it('should set the output stream array in the thread', async() => {
      const stream = createStream(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9]))
      const thread = createThread()
      const nodeId = addNode(thread, 'output', { input: { name: 'result', value: stream } })
      await startNode(thread, nodeId)
      expect(thread.output).toStrictEqual({ result: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9]) })
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
