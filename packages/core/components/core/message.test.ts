import { addNode, createThread, getNodeComponent, startNode } from '../thread'
import { ERRORS as E } from '../utils'
import { message } from './message'

describe('message', () => {
  describe('role', () => {
    it('should generate a message object based on the input data', async() => {
      const thread = createThread()
      const id = addNode(thread, 'message', {
        input: {
          role: 'user',
          content: 'Hello, world!',
        },
      })
      const result = await startNode(thread, id)
      expect(result).toStrictEqual({
        message: {
          role: 'user',
          content: 'Hello, world!',
        },
      })
    })

    it('should create an assistant message', async() => {
      const thread = createThread()
      const id = addNode(thread, 'message', {
        input: {
          role: 'assistant',
          content: 'Hello, world!',
        },
      })
      const result = await startNode(thread, id)
      expect(result).toStrictEqual({
        message: {
          role: 'assistant',
          content: 'Hello, world!',
        },
      })
    })

    it('should create a system message', async() => {
      const thread = createThread()
      const id = addNode(thread, 'message', {
        input: {
          role: 'system',
          content: 'Hello, world!',
        },
      })
      const result = await startNode(thread, id)
      expect(result).toStrictEqual({
        message: {
          role: 'system',
          content: 'Hello, world!',
        },
      })
    })
  })

  describe('schema validation', () => {
    it('should throw an error if the role is not provided', async() => {
      const thread = createThread()
      const id = addNode(thread, 'message', { input: { content: 'Hello, world!' } })
      const shouldReject = startNode(thread, id)
      const error = E.NODE_INPUT_SCHEMA_MISMATCH(id, {
        role: E.INPUT_REQUIRED('role'),
      })
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw an error if the role is not a string', async() => {
      const thread = createThread()
      const id = addNode(thread, 'message', { input: { role: 123, content: 'Hello, world!' } })
      const shouldReject = startNode(thread, id)
      const error = E.NODE_INPUT_SCHEMA_MISMATCH(id, {
        role: E.INPUT_NOT_IN_ENUM('role', ['user', 'assistant', 'system']),
      })
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw an error if the role is not one of the allowed values', async() => {
      const thread = createThread()
      const id = addNode(thread, 'message', { input: { role: 'admin', content: 'Hello, world!' } })
      const shouldReject = startNode(thread, id)
      const error = E.NODE_INPUT_SCHEMA_MISMATCH(id, {
        role: E.INPUT_NOT_IN_ENUM('role', ['user', 'assistant', 'system']),
      })
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw an error if the content is not provided', async() => {
      const thread = createThread()
      const id = addNode(thread, 'message', { input: { role: 'user' } })
      const shouldReject = startNode(thread, id)
      const error = E.NODE_INPUT_SCHEMA_MISMATCH(id, {
        content: E.INPUT_REQUIRED('content'),
      })
      await expect(shouldReject).rejects.toThrow(error)
    })
  })

  describe('native component', () => {
    it('should be included in the native components', async() => {
      const thread = createThread()
      const id = addNode(thread, 'message')
      const component = await getNodeComponent(thread, id)
      expect(component).toStrictEqual(message)
    })
  })
})
