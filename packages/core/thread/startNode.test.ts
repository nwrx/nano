/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createReference, defineComponent } from '../utils'
import { addNode } from './addNode'
import { createThread } from './createThread'
import { getNode } from './getNode'
import { startNode } from './startNode'

function createComponent() {
  return defineComponent(
    {
      isTrusted: true,
      inputs: { name: { type: 'string' } },
      outputs: { result: { type: 'string' } },
    },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    vi.fn(({ data }) => ({ result: `Hello, ${data.name}!` })),
  )
}

describe('startNode', () => {
  beforeAll(() => {
    vi.useFakeTimers({ now: new Date('2020-01-01T00:00:00.000Z') })
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  describe('data', () => {
    it('should resolve the input references and put them in the resolved data', async() => {
      const thread = createThread({ referenceResolvers: [() => 'Universe'] })
      const id = addNode(thread, 'core/example', {
        input: { name: createReference('Variables', 'Something') },
        component: createComponent(),
      })
      const result = await startNode(thread, id)
      expect(result).toStrictEqual({ result: 'Hello, Universe!' })
    })

    it('should call the process function with the resolved data', async() => {
      const component = createComponent()
      const thread = createThread()
      const nodeId = addNode(thread, 'core/example', {
        input: { name: 'World' },
        component,
      })
      await startNode(thread, nodeId)
      expect(component.process).toHaveBeenCalledOnce()
      expect(component.process).toHaveBeenCalledWith({
        data: { name: 'World' },
        thread,
        nodeId,
      })
    })

    it('should override the data with the data argument', async() => {
      const component = createComponent()
      const thread = createThread()
      const nodeId = addNode(thread, 'core/example', {
        input: { name: 'World' },
        component,
      })
      await startNode(thread, nodeId, { name: 'Universe' })
      expect(component.process).toHaveBeenCalledWith({
        data: { name: 'Universe' },
        thread,
        nodeId,
      })
    })

    it('should not expose the "thread" and "nodeId" when the component is untrusted', async() => {
      const component = createComponent()
      component.isTrusted = false
      component.process = ({ data, thread, nodeId }) => ({
        hasThread: thread,
        hasNodeId: nodeId,
        result: `Hello, ${data.name}!`,
      })
      const thread = createThread()
      const nodeId = addNode(thread, 'core/example', {
        input: { name: 'World' },
        component,
      })
      const result = await startNode(thread, nodeId)
      expect(result).toStrictEqual({
        hasThread: undefined,
        hasNodeId: undefined,
        result: 'Hello, World!',
      })
    })
  })

  describe('process', () => {
    it('should call the process function in the main thread', async() => {
      const component = createComponent()
      component.process = vi.fn()
      const thread = createThread()
      const id = addNode(thread, 'example', { input: { name: 'World' }, component })
      await startNode(thread, id)
      expect(component.process).toHaveBeenCalled()
    })

    it('should call the process function in the sandbox', async() => {
      const component = createComponent()
      component.isTrusted = false
      // @ts-expect-error: override the process function
      component.process = () => {
        const error = new Error('foo')
        return { stack: error.stack }
      }
      const thread = createThread()
      const id = addNode(thread, 'example', { input: { name: 'World' }, component })
      const result = await startNode(thread, id)
      expect(result).toStrictEqual({ stack: expect.stringMatching(/sandbox\.js/) })
    })

    it('should throw when trying to break out of the sandbox of an untrusted component', async() => {
      const component = createComponent()
      component.isTrusted = false
      const value = 'Hello, World!'
      // @ts-expect-error: override the process function
      component.process = () => ({ value })
      const thread = createThread()
      const id = addNode(thread, 'example', { input: { name: 'World' }, component })
      const shouldReject = startNode(thread, id)
      await expect(shouldReject).rejects.toThrow('value is not defined')
    })
  })

  describe('result', () => {
    it('should start a node and return the result', async() => {
      const thread = createThread()
      const id = addNode(thread, 'core/example', {
        input: { name: 'World' },
        component: createComponent(),
      })
      const result = await startNode(thread, id)
      expect(result).toStrictEqual({ result: 'Hello, World!' })
    })

    it('should resolve the component before starting the node', async() => {
      const thread = createThread({ componentResolvers: [() => createComponent()] })
      const id = addNode(thread, 'core/example', {
        input: { name: 'World' },
      })
      const result = await startNode(thread, id)
      expect(result).toStrictEqual({ result: 'Hello, World!' })
    })

    it('should store the date and timestamp when the node starts', async() => {
      const thread = createThread()
      const id = addNode(thread, 'core/example', {
        input: { name: 'World' },
        component: createComponent(),
      })
      await startNode(thread, id)
      const node = getNode(thread, id)
      expect(node.startedAt).toBe(1577836800000)
    })
  })

  describe('events', () => {
    it('should dispatch the "nodeState" event for each state change', async() => {
      const thread = createThread()
      const component = createComponent()
      const id = addNode(thread, 'core/example', { input: { name: 'World' }, component })
      const callback = vi.fn()
      thread.on('nodeState', callback)
      await startNode(thread, id)
      expect(callback).toHaveBeenNthCalledWith(1, id, {
        delta: 0,
        duration: 0,
        state: 'starting',
        timestamp: '2020-01-01T00:00:00.000Z',
      })
      expect(callback).toHaveBeenNthCalledWith(2, id, {
        delta: 0,
        duration: 0,
        state: 'processing',
        timestamp: '2020-01-01T00:00:00.000Z',
      })
      expect(callback).toHaveBeenNthCalledWith(3, id, {
        delta: 0,
        duration: 0,
        state: 'done',
        timestamp: '2020-01-01T00:00:00.000Z',
      })
    })

    it('should dispatch the "nodeStart" event when the node starts', async() => {
      const thread = createThread()
      const component = createComponent()
      const id = addNode(thread, 'core/example', { input: { name: 'World' }, component })
      const callback = vi.fn()
      thread.on('nodeStart', callback)
      await startNode(thread, id)
      expect(callback).toHaveBeenCalledWith(id, { name: 'World' }, {
        delta: 0,
        duration: 0,
        state: 'processing',
        timestamp: '2020-01-01T00:00:00.000Z',
      } )
    })

    it('should dispatch the "nodeDone" event when the node ends', async() => {
      const thread = createThread()
      const component = createComponent()
      const id = addNode(thread, 'core/example', { input: { name: 'World' }, component })
      const callback = vi.fn()
      thread.on('nodeDone', callback)
      await startNode(thread, id)
      expect(callback).toHaveBeenCalledWith(id, { result: 'Hello, World!' }, {
        delta: 0,
        duration: 0,
        state: 'done',
        timestamp: '2020-01-01T00:00:00.000Z',
      } )
    })
  })

  describe('errors', () => {
    it('should reject the promise if the node errors', async() => {
      const component = createComponent()
      component.process = vi.fn(() => { throw new Error('Process error') })
      const thread = createThread()
      const id = addNode(thread, 'core/example', { input: { name: 'World' }, component })
      const shouldReject = startNode(thread, id)
      await expect(shouldReject).rejects.toThrow('Process error')
    })

    it('should dispatch the "nodeError" event when the node errors', async() => {
      const component = createComponent()
      component.process = vi.fn(() => { throw new Error('Process error') })
      const thread = createThread()
      const id = addNode(thread, 'core/example', { input: { name: 'World' }, component })
      const callback = vi.fn()
      thread.on('nodeError', callback)
      await startNode(thread, id).catch(() => {})
      expect(callback).toHaveBeenCalledWith(id, new Error('Process error'), {
        delta: 0,
        duration: 0,
        state: 'error',
        timestamp: '2020-01-01T00:00:00.000Z',
      } )
    })

    it('should not dispatch the "nodeDone" event when the node errors', async() => {
      const component = createComponent()
      component.process = vi.fn(() => { throw new Error('Process error') })
      const thread = createThread()
      const id = addNode(thread, 'core/example', { input: { name: 'World' }, component })
      const callback = vi.fn()
      thread.on('nodeDone', callback)
      await startNode(thread, id).catch(() => {})
      expect(callback).not.toHaveBeenCalled()
    })
  })
})
