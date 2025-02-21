import type { LanguageModelRequestContext } from './languageModelSchema'
import { addNode, createThread } from '../../../thread'
import { defineComponent } from '../../../utils'
import { defineTool } from '../../../utils/defineTool'
import { handleResponseMessages } from './handleResponseMessages'

function createContext(...calls: Array<(...args: any[]) => any>) {
  const thread = createThread()
  const component = defineComponent({})
  const nodeId = addNode(thread, 'example', { component })
  const tools = calls.map((call, i) => defineTool(nodeId, {
    name: `tool-${i + 1}`,
    description: 'Tool description',
    properties: {},
    call: vi.fn(call),
  }))
  return {
    thread,
    nodeId,
    tools,
    messages: [],
  } as unknown as LanguageModelRequestContext
}

describe('onResponsePushMessages', () => {
  describe('text messages', () => {
    it('should push text messages to the context', async() => {
      const context = createContext()
      context.messages.push({ role: 'user', content: 'Hello' })
      await handleResponseMessages(context, { role: 'assistant', content: 'Hi' })
      expect(context.messages).toEqual([
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi' },
      ])
    })
  })

  describe('tool requests', () => {
    it('should call the tool when a tool request is received', async() => {
      const context = createContext(() => ({ ok: true }))
      await handleResponseMessages(context, {
        role: 'tool_request',
        id: 'tool-execution-id',
        name: 'tool-1',
        input: { value: 'Hello' },
      })
      expect(context.tools[0].call).toHaveBeenCalledOnce()
      expect(context.tools[0].call).toHaveBeenCalledWith({ value: 'Hello' })
    })

    it('should push tool request and results to the messages', async() => {
      const context = createContext(() => ({ ok: true }))
      await handleResponseMessages(context, {
        role: 'tool_request',
        id: 'tool-execution-id',
        name: 'tool-1',
        input: { value: 'Hello' },
      })
      expect(context.messages).toEqual([
        { role: 'tool_request', id: 'tool-execution-id', name: 'tool-1', input: { value: 'Hello' } },
        { role: 'tool_result', id: 'tool-execution-id', isError: false, result: { ok: true } },
      ])
    })

    it('should push tool request and errors to the messages', async() => {
      const context = createContext(() => { throw new Error('Tool error') })
      await handleResponseMessages(context, {
        role: 'tool_request',
        id: 'tool-execution-id',
        name: 'tool-1',
        input: { value: 'Hello' },
      })
      expect(context.messages).toEqual([
        { role: 'tool_request', id: 'tool-execution-id', name: 'tool-1', input: { value: 'Hello' } },
        { role: 'tool_result', id: 'tool-execution-id', isError: true, result: { error: 'Tool error' } },
      ])
    })
  })

  describe('multiple tool requests', () => {
    it('should call multiple tools and push the results next to the requests', async() => {
      const context = createContext(
        vi.fn(() => ({ value: 1 })),
        vi.fn(() => ({ value: 2 })),
      )
      await handleResponseMessages(
        context,
        { role: 'tool_request', id: 'tool-execution-1', name: 'tool-1', input: { value: '1' } },
        { role: 'tool_request', id: 'tool-execution-2', name: 'tool-2', input: { value: '2' } },
      )
      expect(context.tools[0].call).toHaveBeenCalledOnce()
      expect(context.tools[1].call).toHaveBeenCalledOnce()
      expect(context.tools[0].call).toHaveBeenCalledWith({ value: '1' })
      expect(context.tools[1].call).toHaveBeenCalledWith({ value: '2' })
      expect(context.messages).toEqual([
        { role: 'tool_request', id: 'tool-execution-1', name: 'tool-1', input: { value: '1' } },
        { role: 'tool_result', id: 'tool-execution-1', isError: false, result: { value: 1 } },
        { role: 'tool_request', id: 'tool-execution-2', name: 'tool-2', input: { value: '2' } },
        { role: 'tool_result', id: 'tool-execution-2', isError: false, result: { value: 2 } },
      ])
    })

    it('should push tool request and errors to the messages', async() => {
      const context = createContext(
        vi.fn(() => ({ ok: true })),
        vi.fn(() => { throw new Error('Tool error') }),
      )
      await handleResponseMessages(
        context,
        { role: 'tool_request', id: 'tool-execution-1', name: 'tool-1', input: { value: '1' } },
        { role: 'tool_request', id: 'tool-execution-2', name: 'tool-2', input: { value: '2' } },
      )
      expect(context.tools[0].call).toHaveBeenCalledOnce()
      expect(context.tools[1].call).toHaveBeenCalledOnce()
      expect(context.tools[0].call).toHaveBeenCalledWith({ value: '1' })
      expect(context.tools[1].call).toHaveBeenCalledWith({ value: '2' })
      expect(context.messages).toEqual([
        { role: 'tool_request', id: 'tool-execution-2', name: 'tool-2', input: { value: '2' } },
        { role: 'tool_result', id: 'tool-execution-2', isError: true, result: { error: 'Tool error' } },
        { role: 'tool_request', id: 'tool-execution-1', name: 'tool-1', input: { value: '1' } },
        { role: 'tool_result', id: 'tool-execution-1', isError: false, result: { ok: true } },
      ])
    })
  })

  describe('mixed messages', () => {
    it('should push text messages and tool requests to the messages', async() => {
      const context = createContext(() => ({ ok: true }))
      await handleResponseMessages(
        context,
        { role: 'assistant', content: 'Hello' },
        { role: 'tool_request', id: 'tool-execution-id', name: 'tool-1', input: {} },
      )
      expect(context.messages).toEqual([
        { role: 'assistant', content: 'Hello' },
        { role: 'tool_request', id: 'tool-execution-id', name: 'tool-1', input: {} },
        { role: 'tool_result', id: 'tool-execution-id', isError: false, result: { ok: true } },
      ])
    })
  })

  describe('edge cases', () => {
    it('should throw when trying to push a message with an user role', async() => {
      // @ts-expect-error: `context` is unimportant for this test
      const shouldReject = handleResponseMessages({}, { role: 'user', content: 'Hello' })
      await expect(shouldReject).rejects.toThrow('Invalid message role: user')
    })

    it('should throw when trying to push a message with an invalid role', async() => {
      // @ts-expect-error: `context` is unimportant for this test
      const shouldReject = handleResponseMessages({}, { role: 'invalid', content: 'Hello' })
      await expect(shouldReject).rejects.toThrow('Invalid message role: invalid')
    })
  })
})
