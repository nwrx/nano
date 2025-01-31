/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { addNode, createThread } from '../../../thread'
import { createEventMetadata, ERRORS } from '../../../utils'
import { askQuestion } from './askQuestion'

describe('askQuestion', () => {
  beforeAll(() => {
    vi.useFakeTimers({ now: new Date('2020-01-01T00:00:00Z') })
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  describe('question', () => {
    it('should dispatch a "nodeQuestionRequest" event with the correct parameters', () => {
      const thread = createThread()
      const nodeId = addNode(thread, 'example')
      const callback = vi.fn()
      thread.on('nodeQuestionRequest', callback)
      void askQuestion(thread, nodeId, { question: 'example', text: 'example' })
      expect(callback).toHaveBeenCalledOnce()
      expect(callback).toHaveBeenCalledWith(
        nodeId,
        {
          id: expect.any(String),
          question: 'example',
          text: 'example',
          choices: undefined,
          timeout: 60000,
        },
        createEventMetadata(thread, nodeId),
      )
    })

    it('should resolve to the correct response when dispatching a "nodeQuestionResponse" event', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'example')
      const callback = vi.fn()
      thread.on('nodeResponse', callback)
      const eventId = new Promise<string>(resolve => thread.on('nodeQuestionRequest', (_, { id }) => resolve(id)))
      const promise = askQuestion(thread, nodeId, { question: 'ignored', text: 'ignored' })
      thread.dispatch('nodeResponse', nodeId, { id: await eventId, response: 'Hello, World!' }, createEventMetadata(thread, nodeId))
      await expect(promise).resolves.toBe('Hello, World!')
    })
  })

  describe('matching', () => {
    it('should not resolve when dispatching a "nodeQuestionResponse" for a different event', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'example')
      const shouldReject = askQuestion(thread, nodeId, { question: 'ignored', text: 'ignored', timeout: 1 })
      thread.dispatch('nodeResponse', nodeId, { id: 'differentId', response: 'response' }, createEventMetadata(thread, nodeId))
      vi.advanceTimersByTime(1)
      await expect(shouldReject).rejects.toThrow()
    })

    it('should not resolve when dispatching a "nodeQuestionResponse" for a different node', async() => {
      const thread = createThread()
      const nodeId1 = addNode(thread, 'example')
      const nodeId2 = addNode(thread, 'example')
      const shouldReject = askQuestion(thread, nodeId1, { question: 'ignored', text: 'ignored', timeout: 1 })
      thread.dispatch('nodeResponse', nodeId2, { id: 'differentId', response: 'response' }, createEventMetadata(thread, nodeId2))
      vi.advanceTimersByTime(1)
      await expect(shouldReject).rejects.toThrow()
    })
  })

  describe('error handling', () => {
    it('should throw if the node does not exist', async() => {
      const thread = createThread()
      const shouldReject = askQuestion(thread, 'invalidNodeId', { question: 'ignored', text: 'ignored' })
      const errors = ERRORS.NODE_NOT_FOUND('invalidNodeId')
      await expect(shouldReject).rejects.toThrow(errors)
    })

    it('should throw if the node times out with a custom timeout', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'example')
      const shouldReject = askQuestion(thread, nodeId, { question: 'ignored', text: 'ignored', timeout: 1 })
      vi.advanceTimersByTime(1)
      await expect(shouldReject).rejects.toThrow('Timeout.')
    })

    it('should throw if no response is received within default timeout', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'example')
      const shouldReject = askQuestion(thread, nodeId, { question: 'ignored', text: 'ignored' })
      vi.advanceTimersByTime(60000)
      await expect(shouldReject).rejects.toThrow('Timeout.')
    })
  })
})
