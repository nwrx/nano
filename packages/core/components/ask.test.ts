/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { EXP_UUID } from '@unshared/validation'
import { addNode, createThread, getNode, getNodeComponent, sendResponse, startNode } from '../thread'
import { createEventMetadata, ERRORS } from '../utils'
import { ask } from './ask'

describe('ask component', () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: new Date('2020-01-01T00:00:00.000Z') })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('ask', () => {
    it('should ask a question and return the response', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'ask', {
        input: {
          question: 'What is your name?',
          text: 'Please enter your name.',
          choices: [{ value: 'John Doe', label: 'John Doe' }],
          timeout: 1,
        },
      })
      thread.on('nodeQuestionRequest', (_, { id: eventId }) => sendResponse(thread, nodeId, eventId, 'John Doe'))
      const result = await startNode(thread, nodeId)
      expect(result).toStrictEqual({ response: 'John Doe' })
    })

    it('should dispatch the "nodeQuestionRequest" event', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'ask', {
        input: {
          question: 'What is your name?',
          text: 'Please enter your name.',
          choices: [{ value: 'John Doe', label: 'John Doe' }],
          timeout: 1,
        },
      })
      const callback = vi.fn()
      thread.on('nodeQuestionRequest', callback)
      void startNode(thread, nodeId).catch(() => {})
      await new Promise(resolve => process.nextTick(resolve))
      expect(callback).toHaveBeenCalledOnce()
      expect(callback).toHaveBeenCalledWith(nodeId, {
        id: expect.stringMatching(EXP_UUID),
        question: 'What is your name?',
        text: 'Please enter your name.',
        choices: [{ value: 'John Doe', label: 'John Doe' }],
        timeout: 1,
      }, createEventMetadata(thread, getNode(thread, nodeId)))
    })

    it('should throw if timeout is reached', async() => {
      const thread = createThread()
      const id = addNode(thread, 'ask', { input: { question: 'What is your name?', timeout: 1 } })
      const shouldReject = startNode(thread, id)
      await new Promise(resolve => process.nextTick(resolve))
      vi.advanceTimersByTime(1)
      await expect(shouldReject).rejects.toThrow('Timeout.')
    })
  })

  describe('schema validation', () => {
    it('should throw if the question is missing', async() => {
      const thread = createThread()
      const id = addNode(thread, 'ask', { input: { timeout: 1 } })
      const shouldReject = startNode(thread, id)
      const error = ERRORS.NODE_INPUT_SCHEMA_MISMATCH(id, {
        question: ERRORS.INPUT_REQUIRED('question'),
      })
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw if the question is not a string', async() => {
      const thread = createThread()
      const id = addNode(thread, 'ask', { input: { question: 123, timeout: 1 } })
      const shouldReject = startNode(thread, id)
      const error = ERRORS.NODE_INPUT_SCHEMA_MISMATCH(id, {
        question: ERRORS.INPUT_NOT_STRING('question'),
      })
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw if the choices is not an array', async() => {
      const thread = createThread()
      const id = addNode(thread, 'ask', { input: { question: 'What is your name?', choices: 'John Doe', timeout: 1 } })
      const shouldReject = startNode(thread, id)
      const error = ERRORS.NODE_INPUT_SCHEMA_MISMATCH(id, {
        choices: ERRORS.INPUT_NOT_ARRAY('choices'),
      })
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw if the timeout is not a number', async() => {
      const thread = createThread()
      const id = addNode(thread, 'ask', { input: { question: 'What is your name?', timeout: true } })
      const shouldReject = startNode(thread, id)
      const error = ERRORS.NODE_INPUT_SCHEMA_MISMATCH(id, {
        timeout: ERRORS.INPUT_NOT_NUMBER('timeout'),
      })
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw if the timeout is less than 0', async() => {
      const thread = createThread()
      const id = addNode(thread, 'ask', { input: { question: 'What is your name?', timeout: -1 } })
      const shouldReject = startNode(thread, id)
      const error = ERRORS.NODE_INPUT_SCHEMA_MISMATCH(id, {
        timeout: ERRORS.INPUT_NUMBER_TOO_SMALL('timeout', 0),
      })
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw if the timeout is not an integer', async() => {
      const thread = createThread()
      const id = addNode(thread, 'ask', { input: { question: 'What is your name?', timeout: 0.5 } })
      const shouldReject = startNode(thread, id)
      const error = ERRORS.NODE_INPUT_SCHEMA_MISMATCH(id, {
        timeout: ERRORS.INPUT_NUMBER_NOT_INTEGER('timeout'),
      })
      await expect(shouldReject).rejects.toThrow(error)
    })
  })

  describe('native component', () => {
    it('should be included in the native components', async() => {
      const thread = createThread()
      const id = addNode(thread, 'ask')
      const component = await getNodeComponent(thread, id)
      expect(component).toStrictEqual(ask)
    })
  })
})
