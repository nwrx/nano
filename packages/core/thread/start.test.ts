import { addNode, createThread } from './'
import { start } from './start'

describe('start', () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: new Date('2020-01-01T00:00:00.000Z') })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('input', () => {
    it('should pass the input values to the core/input nodes', async() => {
      const thread = createThread()
      const id = addNode(thread, 'input', {
        id: 'input',
        input: { name: 'Message' },
        dangereouslyRunInUnsandboxedEnvironment: true,
      })
      const node = thread.nodes.get(id)
      const callback = vi.fn()
      thread.on('nodeDone', callback)
      await start(thread, { Message: 'Hello, world!' })
      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledWith(id, node, { value: 'Hello, world!' }, {
        delta: 0,
        duration: 0,
        state: 'done',
        timestamp: '2020-01-01T00:00:00.000Z',
      })
    })

    it('should pass undefined if the input is not provided and not required', async() => {
      const thread = createThread()
      const id = addNode(thread, 'input', {
        id: 'input',
        input: { name: 'Message', required: false },
        dangereouslyRunInUnsandboxedEnvironment: true,
      })
      const node = thread.nodes.get(id)
      const callback = vi.fn()
      thread.on('nodeDone', callback)
      await start(thread)
      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledWith(id, node, { value: undefined }, {
        delta: 0,
        duration: 0,
        state: 'done',
        timestamp: '2020-01-01T00:00:00.000Z',
      })
    })

    it('should throw an error if the input is not provided and required', async() => {
      const thread = createThread()
      addNode(thread, 'input', {
        id: 'input',
        input: { name: 'Message', required: true },
        dangereouslyRunInUnsandboxedEnvironment: true,
      })
      const shouldReject = start(thread)
      const error = new Error('Input "Message" is required but not provided.')
      await expect(shouldReject).rejects.toThrow(error)
    })
  })

  describe('output', () => {
    it('should collect output values from core/output nodes', async() => {
      const thread = createThread()
      addNode(thread, 'output', {
        id: 'output',
        input: { name: 'Response', value: 'Hello, world!' },
        dangereouslyRunInUnsandboxedEnvironment: true,
      })
      const result = await start(thread, { Message: 'Hello, world!' })
      expect(result).toStrictEqual({ Response: 'Hello, world!' })
    })

    it('should dispatch the "output" event for each core/output node', async() => {
      const thread = createThread()
      addNode(thread, 'output', {
        id: 'output1',
        input: { name: 'Response1', value: 'Hello, world!' },
        dangereouslyRunInUnsandboxedEnvironment: true,
      })
      addNode(thread, 'output', {
        id: 'output2',
        input: { name: 'Response2', value: 'Hello, world!' },
        dangereouslyRunInUnsandboxedEnvironment: true,
      })
      const output = vi.fn()
      thread.on('output', output)
      await start(thread, { Message: 'Hello, world!' })
      expect(output).toHaveBeenCalledTimes(2)
      expect(output).toHaveBeenNthCalledWith(1, 'Response1', 'Hello, world!', {
        delta: 0,
        duration: undefined,
        state: undefined,
        timestamp: '2020-01-01T00:00:00.000Z',
      })
      expect(output).toHaveBeenNthCalledWith(2, 'Response2', 'Hello, world!', {
        delta: 0,
        duration: undefined,
        state: undefined,
        timestamp: '2020-01-01T00:00:00.000Z',
      })
    })

    it('should dispatch the "done" event when all nodes are done with the output', async() => {
      const thread = createThread()
      addNode(thread, 'output', {
        id: 'output',
        input: { name: 'Response', value: 'Hello, world!' },
        dangereouslyRunInUnsandboxedEnvironment: true,
      })
      const end = vi.fn()
      thread.on('done', end)
      await start(thread, { Message: 'Hello, world!' })
      expect(end).toHaveBeenCalledTimes(1)
      expect(end).toHaveBeenCalledWith({ Response: 'Hello, world!' }, {
        delta: 0,
        duration: undefined,
        state: undefined,
        timestamp: '2020-01-01T00:00:00.000Z',
      })
    })
  })
})
