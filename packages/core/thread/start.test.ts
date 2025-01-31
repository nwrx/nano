/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { defineComponent, ERRORS as E, toolSchema } from '../utils'
import { addLink } from './addLink'
import { addNode } from './addNode'
import { createThread } from './createThread'
import { start } from './start'

const greet = defineComponent(
  {
    isTrusted: true,
    inputs: {
      greet: {
        type: 'string',
        default: 'Hello',
      },
      name: {
        type: 'string',
        default: 'World',
      },
    },
    outputs: {
      result: {
        type: 'string',
      },
    },
  },
  ({ data }) => ({
    result: `${data.greet}, ${data.name}!`,
  }),
)

const passthrough = defineComponent(
  {
    isTrusted: true,
    inputs: {
      value: {
        oneOf: [
          { type: 'object' },
          { type: 'string' },
          { type: 'number' },
          { type: 'boolean' },
        ],
      },
      delay: {
        type: 'number',
        default: 0,
      },
    },
    outputs: {
      value: {},
    },
  },
  ({ data }) => new Promise((resolve) => {
    setTimeout(() => resolve({ value: data.value }), data.delay)
  }),
)

const throws = defineComponent(
  {
    isTrusted: true,
  },
  () => {
    throw new Error('error during node processing')
  },
)

const callingTool = defineComponent(
  {
    isTrusted: true,
    inputs: {
      tool: {
        ...toolSchema,
      },
      parameters: {
        type: 'object',
        default: {},
      },
    },
    outputs: {
      result: {},
    },
  },
  async({ data }) => ({
    result: await data.tool.call(data.parameters),
  }),
)

describe('start', () => {
  describe('start', () => {
    it('should record the start time of the thread', async() => {
      const thread = createThread()
      await start(thread)
      expect(thread.startedAt).toBeGreaterThan(Date.now() - 1000)
    })

    it('should set the input object from the parameter', async() => {
      const thread = createThread()
      await start(thread, { name: 'Alice' })
      expect(thread.input).toEqual({ name: 'Alice' })
    })

    it('should dispatch the "start" event', async() => {
      const thread = createThread()
      const callback = vi.fn()
      thread.on('start', callback)
      await start(thread)
      expect(callback).toHaveBeenCalledOnce()
      expect(callback).toHaveBeenCalledWith({})
    })

    it('should dispatch the "start" event with the input object', async() => {
      const thread = createThread()
      const callback = vi.fn()
      thread.on('start', callback)
      await start(thread, { name: 'Alice' })
      expect(callback).toHaveBeenCalledOnce()
      expect(callback).toHaveBeenCalledWith({ name: 'Alice' })
    })

    it('should resolve the promise immediately if no nodes are present', async() => {
      const thread = createThread()
      const callback = vi.fn()
      thread.on('done', callback)
      await start(thread)
      expect(callback).toHaveBeenCalledOnce()
      expect(callback).toHaveBeenCalledWith({})
    })
  })

  describe('done', () => {
    it('should resolve the promise with the output object', async() => {
      const thread = createThread()
      thread.output = { result: 'Hello, World!' }
      const output = await start(thread)
      expect(output).toEqual({ result: 'Hello, World!' })
    })

    it('should dispatch the "done" event when all nodes are done', async() => {
      const thread = createThread()
      thread.output = { result: 'Hello, World!' }
      const callback = vi.fn()
      thread.on('done', callback)
      await start(thread)
      expect(callback).toHaveBeenCalledOnce()
      expect(callback).toHaveBeenCalledWith({ result: 'Hello, World!' })
    })

    it('should clean up the event listeners after the thread is done', async() => {
      const thread = createThread()
      await start(thread)
      expect(thread.eventListeners).toHaveLength(0)
    })

    it('should dispatch the "done" event when all nodes are done, even if the thread is empty', async() => {
      const thread = createThread()
      const callback = vi.fn()
      thread.on('done', callback)
      await start(thread)
      expect(callback).toHaveBeenCalledOnce()
      expect(callback).toHaveBeenCalledWith({})
    })

    it('should dispatch the "done" event with the output object', async() => {
      const thread = createThread()
      addNode(thread, 'output', { input: { value: 'Hello, World!', name: 'result' } })
      const output = await start(thread)
      expect(output).toEqual({ result: 'Hello, World!' })
    })
  })

  describe('flow', () => {
    it('should start nodes with no incoming links', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'example', { component: greet })
      const callback = vi.fn()
      thread.on('nodeDone', callback)
      await start(thread)
      expect(callback).toHaveBeenCalledOnce()
      expect(callback).toHaveBeenCalledWith(nodeId, { result: 'Hello, World!' })
    })

    it('should start multiple nodes with no incoming links', async() => {
      vi.useRealTimers()
      const thread = createThread()
      const nodeId1 = addNode(thread, 'example', { component: greet, input: { name: 'Alice' } })
      const nodeId2 = addNode(thread, 'example', { component: greet, input: { name: 'Bob' } })
      const callback = vi.fn()
      thread.on('nodeStart', (...args) => callback('nodeStart', ...args))
      thread.on('nodeDone', (...args) => callback('nodeDone', ...args))
      await start(thread)
      expect(callback).toHaveBeenCalledTimes(4)
      expect(callback).toHaveBeenNthCalledWith(1, 'nodeStart', nodeId1, { greet: 'Hello', name: 'Alice' })
      expect(callback).toHaveBeenNthCalledWith(2, 'nodeStart', nodeId2, { greet: 'Hello', name: 'Bob' })
      expect(callback).toHaveBeenNthCalledWith(3, 'nodeDone', nodeId1, { result: 'Hello, Alice!' })
      expect(callback).toHaveBeenNthCalledWith(4, 'nodeDone', nodeId2, { result: 'Hello, Bob!' })
    })

    it('should start nodes with incoming links when the source node is done', async() => {
      vi.useRealTimers()
      const thread = createThread()
      const sourceId = addNode(thread, 'example', { component: passthrough, input: { value: 'World' } })
      const targetId = addNode(thread, 'example', { component: greet })
      await addLink(thread, { sourceId, sourceName: 'value', targetName: 'name', targetId })
      const callback = vi.fn()
      thread.on('nodeStart', (...args) => callback('nodeStart', ...args))
      thread.on('nodeDone', (...args) => callback('nodeDone', ...args))
      await start(thread)
      expect(callback).toHaveBeenCalledTimes(4)
      expect(callback).toHaveBeenNthCalledWith(1, 'nodeStart', sourceId, { delay: 0, value: 'World' })
      expect(callback).toHaveBeenNthCalledWith(2, 'nodeDone', sourceId, { value: 'World' })
      expect(callback).toHaveBeenNthCalledWith(3, 'nodeStart', targetId, { greet: 'Hello', name: 'World' })
      expect(callback).toHaveBeenNthCalledWith(4, 'nodeDone', targetId, { result: 'Hello, World!' })
    })

    it('should wait for all incoming links to be ready before starting the node', async() => {
      vi.useRealTimers()
      const thread = createThread()
      const sourceId1 = addNode(thread, 'example', { component: passthrough, input: { value: 'Hello' } })
      const sourceId2 = addNode(thread, 'example', { component: passthrough, input: { value: 'World' } })
      const targetId = addNode(thread, 'example', { component: greet })
      await addLink(thread, { sourceId: sourceId1, sourceName: 'value', targetName: 'greet', targetId })
      await addLink(thread, { sourceId: sourceId2, sourceName: 'value', targetName: 'name', targetId })
      const callback = vi.fn()
      thread.on('nodeStart', (...args) => callback('nodeStart', ...args))
      thread.on('nodeDone', (...args) => callback('nodeDone', ...args))
      await start(thread)
      expect(callback).toHaveBeenCalledTimes(6)
      expect(callback).toHaveBeenNthCalledWith(1, 'nodeStart', sourceId1, { delay: 0, value: 'Hello' })
      expect(callback).toHaveBeenNthCalledWith(2, 'nodeStart', sourceId2, { delay: 0, value: 'World' })
      expect(callback).toHaveBeenNthCalledWith(3, 'nodeDone', sourceId1, { value: 'Hello' })
      expect(callback).toHaveBeenNthCalledWith(4, 'nodeDone', sourceId2, { value: 'World' })
      expect(callback).toHaveBeenNthCalledWith(5, 'nodeStart', targetId, { greet: 'Hello', name: 'World' })
      expect(callback).toHaveBeenNthCalledWith(6, 'nodeDone', targetId, { result: 'Hello, World!' })
    })

    it('should handle nodes used as tools in the thread', async() => {
      const thread = createThread()
      const sourceId = addNode(thread, 'example', { component: passthrough })
      const targetId = addNode(thread, 'example', { component: callingTool })
      await addLink(thread, { sourceId, targetId, targetName: 'tool' })
      const callback = vi.fn()
      thread.on('nodeStart', (...args) => callback('nodeStart', ...args))
      thread.on('nodeDone', (...args) => callback('nodeDone', ...args))
      await start(thread)
      expect(callback).toHaveBeenCalledTimes(4)
      expect(callback).toHaveBeenNthCalledWith(1, 'nodeStart', targetId, { parameters: {}, tool: expect.any(Object) })
      expect(callback).toHaveBeenNthCalledWith(2, 'nodeStart', sourceId, {})
      expect(callback).toHaveBeenNthCalledWith(3, 'nodeDone', sourceId, { value: undefined })
      expect(callback).toHaveBeenNthCalledWith(4, 'nodeDone', targetId, { result: {} })
    })
  })

  describe('error', () => {
    it('should reject the promise if the thread is already running', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'example', { component: greet })
      const node = thread.nodes.get(nodeId)!
      node.state = 'processing'
      const shouldReject = start(thread)
      const error = E.THREAD_IS_ALREADY_RUNNING()
      await expect(shouldReject).rejects.toThrowError(error)
    })

    it('should reject the promise if a node errors', async() => {
      const thread = createThread()
      addNode(thread, 'example', { component: throws })
      const shouldReject = start(thread)
      await expect(shouldReject).rejects.toThrow('error during node processing')
    })

    it('should reject the promise if the last node errors', async() => {
      const thread = createThread()
      addNode(thread, 'example', { component: greet })
      addNode(thread, 'example', { component: throws })
      const shouldReject = start(thread)
      await expect(shouldReject).rejects.toThrow('error during node processing')
    })

    it('should not reject the promise if a node errors and the thread is still running', async() => {
      const thread = createThread()
      addNode(thread, 'example', { component: throws })
      addNode(thread, 'example', { component: passthrough, input: { value: 'Hello', delay: 1 } })
      const result = start(thread)
      await expect(result).resolves.toEqual({})
    })

    it('should not dispatch the "done" event when a node errors', async() => {
      const thread = createThread()
      addNode(thread, 'example', { component: throws })
      const done = vi.fn()
      thread.on('done', done)
      await start(thread).catch(() => {})
      expect(done).not.toHaveBeenCalled()
    })
  })
})
