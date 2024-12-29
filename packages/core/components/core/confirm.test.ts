/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { EXP_UUID } from '@unshared/validation'
import { addNode, createThread, getNodeComponent, sendResponse, startNode } from '../../thread'
import { ERRORS } from '../../utils'
import { confirm } from './confirm'

describe('confirm component', () => {
  describe('confirm', () => {
    it('should ask for confirmation and return the response', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'confirm', {
        input: {
          question: 'Are you sure?',
          text: 'Please confirm your action.',
          timeout: 1,
        },
      })
      thread.on('nodeConfirmRequest', (_, { id: eventId }) => sendResponse(thread, nodeId, eventId, true))
      const result = await startNode(thread, nodeId)
      expect(result).toStrictEqual({ response: true })
    })

    it('should dispatch the "nodeConfirmRequest" event', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'confirm', {
        input: {
          question: 'Are you sure?',
          text: 'Please confirm your action.',
          timeout: 1,
        },
      })
      const callback = vi.fn()
      thread.on('nodeConfirmRequest', callback)
      void startNode(thread, nodeId).catch(() => {})
      await new Promise(resolve => process.nextTick(resolve))
      expect(callback).toHaveBeenCalledOnce()
      expect(callback).toHaveBeenCalledWith(nodeId, {
        id: expect.stringMatching(EXP_UUID),
        question: 'Are you sure?',
        text: 'Please confirm your action.',
        timeout: 1,
      })
    })

    it('should throw if timeout is reached', async() => {
      const thread = createThread()
      const id = addNode(thread, 'confirm')
      const shouldReject = startNode(thread, id, { question: 'Are you sure?', timeout: 1 })
      await new Promise(resolve => process.nextTick(resolve))
      await expect(shouldReject).rejects.toThrow('Timeout.')
    })
  })

  describe('schema validation', () => {
    it('should throw if the question is missing', async() => {
      const thread = createThread()
      const id = addNode(thread, 'confirm', { input: { timeout: 1 } })
      const shouldReject = startNode(thread, id)
      const error = ERRORS.NODE_INPUT_SCHEMA_MISMATCH(id, { question: ERRORS.INPUT_REQUIRED('question') })
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw if the question is not a string', async() => {
      const thread = createThread()
      const id = addNode(thread, 'confirm', { input: { question: 123, timeout: 1 } })
      const shouldReject = startNode(thread, id)
      const error = ERRORS.NODE_INPUT_SCHEMA_MISMATCH(id, { question: ERRORS.INPUT_NOT_STRING('question') })
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw if the timeout is not a number', async() => {
      const thread = createThread()
      const id = addNode(thread, 'confirm', { input: { question: 'Are you sure?', timeout: true } })
      const shouldReject = startNode(thread, id)
      const error = ERRORS.NODE_INPUT_SCHEMA_MISMATCH(id, { timeout: ERRORS.INPUT_NOT_NUMBER('timeout') })
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw if the timeout is less than 0', async() => {
      const thread = createThread()
      const id = addNode(thread, 'confirm', { input: { question: 'Are you sure?', timeout: -1 } })
      const shouldReject = startNode(thread, id)
      const error = ERRORS.NODE_INPUT_SCHEMA_MISMATCH(id, { timeout: ERRORS.INPUT_NUMBER_TOO_SMALL('timeout', 0) })
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw if the timeout is not an integer', async() => {
      const thread = createThread()
      const id = addNode(thread, 'confirm', { input: { question: 'Are you sure?', timeout: 0.5 } })
      const shouldReject = startNode(thread, id)
      const error = ERRORS.NODE_INPUT_SCHEMA_MISMATCH(id, { timeout: ERRORS.INPUT_NUMBER_NOT_INTEGER('timeout') })
      await expect(shouldReject).rejects.toThrow(error)
    })
  })

  describe('native component', () => {
    it('should be included in the native components', async() => {
      const thread = createThread()
      const id = addNode(thread, 'confirm')
      const component = await getNodeComponent(thread, id)
      expect(component).toStrictEqual(confirm)
    })
  })
})
