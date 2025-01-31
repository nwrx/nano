/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { EXP_UUID } from '@unshared/validation'
import { addNode, createThread, getNode } from '../thread'
import { createEventMetadata, ERRORS } from '../utils'
import { askConfirmation } from './askConfirmation'

describe('askConfirmation', () => {
  beforeAll(() => {
    vi.useFakeTimers({ now: new Date('2020-01-01T00:00:00Z') })
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  describe('confirmation', () => {
    it('should dispatch a "nodeConfirmRequest" event with the correct parameters', () => {
      const thread = createThread()
      const nodeId = addNode(thread, 'example')
      const callback = vi.fn()
      thread.on('nodeConfirmRequest', callback)
      void askConfirmation(thread, nodeId, { question: 'example', text: 'example', timeout: 60000 })
      expect(callback).toHaveBeenCalledOnce()
      expect(callback).toHaveBeenCalledWith(
        nodeId,
        { id: expect.stringMatching(EXP_UUID), question: 'example', text: 'example', timeout: 60000 },
        createEventMetadata(thread, getNode(thread, nodeId)),
      )
    })

    it('should resolve to "true" when dispatching a "nodeResponse" event with "response: true"', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'example')
      const node = getNode(thread, nodeId)
      const callback = vi.fn()
      thread.on('nodeResponse', callback)
      const eventId = new Promise<string>(resolve => thread.on('nodeConfirmRequest', (_, { id }) => resolve(id)))
      const promise = askConfirmation(thread, nodeId, { question: 'ignored', text: 'ignored' })
      thread.dispatch('nodeResponse', nodeId, { id: await eventId, response: true }, createEventMetadata(thread, node))
      await expect(promise).resolves.toBe(true)
    })

    it('should resolve to "false" when dispatching a "nodeResponse" event with "confirm: false"', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'example')
      const node = getNode(thread, nodeId)
      const callback = vi.fn()
      thread.on('nodeResponse', callback)
      const eventId = new Promise<string>(resolve => thread.on('nodeConfirmRequest', (_, { id }) => resolve(id)))
      const promise = askConfirmation(thread, nodeId, { question: 'ignored', text: 'ignored' })
      thread.dispatch('nodeResponse', nodeId, { id: await eventId, response: false }, createEventMetadata(thread, node))
      await expect(promise).resolves.toBe(false)
    })
  })

  describe('matching', () => {
    it('should not resolve when dispatching a "nodeResponse" for a different event', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'example')
      const node = getNode(thread, nodeId)
      const shouldReject = askConfirmation(thread, nodeId, { question: 'ignored', text: 'ignored', timeout: 1 })
      thread.dispatch('nodeResponse', nodeId, { id: 'differentId', response: true }, createEventMetadata(thread, node))
      vi.advanceTimersByTime(1)
      await expect(shouldReject).rejects.toThrow()
    })

    it('should not resolve when dispatching a "nodeResponse" for a different node', async() => {
      const thread = createThread()
      const nodeId1 = addNode(thread, 'example')
      const nodeId2 = addNode(thread, 'example')
      const node = getNode(thread, nodeId1)
      const shouldReject = askConfirmation(thread, nodeId1, { question: 'ignored', text: 'ignored', timeout: 1 })
      thread.dispatch('nodeResponse', nodeId2, { id: 'differentId', response: true }, createEventMetadata(thread, node))
      vi.advanceTimersByTime(1)
      await expect(shouldReject).rejects.toThrow()
    })
  })

  describe('error handling', () => {
    it('should reject if the node does not exist', () => {
      const thread = createThread()
      const shouldReject = askConfirmation(thread, 'invalidNodeId', { question: 'ignored', text: 'ignored' })
      const error = ERRORS.NODE_NOT_FOUND('invalidNodeId')
      return expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw if the node times out with a custom timeout', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'example')
      const shouldReject = askConfirmation(thread, nodeId, { question: 'ignored', text: 'ignored', timeout: 1 })
      vi.advanceTimersByTime(1)
      await expect(shouldReject).rejects.toThrow('Timeout.')
    })

    it('should throw if the node times out with the default timeout', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'example')
      const shouldReject = askConfirmation(thread, nodeId, { question: 'ignored', text: 'ignored' })
      vi.advanceTimersByTime(60000)
      await expect(shouldReject).rejects.toThrow('Timeout.')
    })
  })
})
