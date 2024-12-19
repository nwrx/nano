import { defineComponent } from '../utils'
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
      const id = addNode(thread, 'input', { input: { name: 'Message' } })
      const callback = vi.fn()
      thread.on('nodeDone', callback)
      await start(thread, { Message: 'Hello, world!' })
      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledWith(id, { value: 'Hello, world!' }, {
        delta: 0,
        duration: 0,
        state: 'done',
        timestamp: '2020-01-01T00:00:00.000Z',
      })
    })

    it('should pass undefined if the input is not provided and not required', async() => {
      const thread = createThread()
      const id = addNode(thread, 'input', { input: { name: 'Message', required: false } })
      const callback = vi.fn()
      thread.on('nodeDone', callback)
      await start(thread)
      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledWith(id, { value: undefined }, {
        delta: 0,
        duration: 0,
        state: 'done',
        timestamp: '2020-01-01T00:00:00.000Z',
      })
    })

    it('should throw an error if the input is not provided and required', async() => {
      const thread = createThread()
      addNode(thread, 'input', { input: { name: 'Message', required: true } })
      const shouldReject = start(thread)
      const error = new Error('Input "Message" is required but not provided.')
      await expect(shouldReject).rejects.toThrow(error)
    })
  })

  describe('output', () => {
    it('should collect output values from core/output nodes', async() => {
      const thread = createThread()
      addNode(thread, 'output', { input: { name: 'Response', value: 'Hello, world!' } })
      const result = await start(thread, { Message: 'Hello, world!' })
      expect(result).toStrictEqual({ Response: 'Hello, world!' })
    })

    it('should resolve the value of the input if it is a reference', async() => {
      const thread = createThread({ referenceResolvers: [() => 'Hello, world!'] })
      addNode(thread, 'output', { input: { name: 'Response', value: { $ref: '#/Variable/Greet' } } })
      const result = await start(thread, { Message: 'Hello, world!' })
      expect(result).toStrictEqual({ Response: 'Hello, world!' })
    })

    it('should dispatch the "output" event for each core/output node', async() => {
      const thread = createThread()
      addNode(thread, 'output', { input: { name: 'Response1', value: 'Hello, world!' } })
      addNode(thread, 'output', { input: { name: 'Response2', value: 'Hello, world!' } })
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
      addNode(thread, 'output', { input: { name: 'Response', value: 'Hello, world!' } })
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

  describe('error handling', () => {
    it('should reject the promise if a node errors', async() => {
      const thread = createThread()
      addNode(thread, 'core/example', {
        input: { name: 'World' },
        component: defineComponent({ isTrusted: true }, () => { throw new Error('node error') }),
      })
      const shouldReject = start(thread)
      await expect(shouldReject).rejects.toThrow('node error')
    })

    it('should dispatch the "error" event when a node errors', async() => {
      const thread = createThread()
      addNode(thread, 'core/example', {
        input: { name: 'World' },
        component: defineComponent({ isTrusted: true }, () => { throw new Error('Process error') }),
      })
      const error = vi.fn()
      thread.on('error', error)
      await start(thread).catch(() => {})
      expect(error).toHaveBeenCalledTimes(1)
      expect(error).toHaveBeenCalledWith(new Error('Process error'), {
        delta: 0,
        duration: undefined,
        state: undefined,
        timestamp: '2020-01-01T00:00:00.000Z',
      })
    })

    it('should abort the thread if a node errors', async() => {
      const thread = createThread()
      addNode(thread, 'core/example', {
        input: { name: 'World' },
        component: defineComponent({ isTrusted: true }, () => { throw new Error('Process error') }),
      })
      const abort = vi.fn()
      thread.on('abort', abort)
      await start(thread).catch(() => {})
      expect(abort).toHaveBeenCalledTimes(1)
      expect(abort).toHaveBeenCalledWith({
        delta: 0,
        duration: undefined,
        state: undefined,
        timestamp: '2020-01-01T00:00:00.000Z',
      })
    })

    it('should abort the abort controller if a node errors', async() => {
      const thread = createThread()
      addNode(thread, 'core/example', {
        input: { name: 'World' },
        component: defineComponent({ isTrusted: true }, () => { throw new Error('Process error') }),
      })
      const callback = vi.fn()
      thread.abortController.signal.addEventListener('abort', callback)
      await start(thread).catch(() => {})
      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledWith(expect.any(Event))
    })
  })
})
