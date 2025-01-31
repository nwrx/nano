import type { LanguageModelMessage } from './languageModelMessageSchema'
import type { LanguageModelRequestContext } from './languageModelSchema'
import { addNode, createThread } from '../../../thread'
import { defineComponent } from '../../../utils'
import { defineTool } from '../../../utils/defineTool'
import { handleResponseMessages } from './handleResponseMessages'

function createContext(...calls: Array<(...args: any[]) => any>) {
  const thread = createThread()
  const component = defineComponent({})
  const nodeId = addNode(thread, 'example', { component })
  const tools = calls.map(call => defineTool({
    nodeId,
    name: 'tool-name',
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
      const messages: LanguageModelMessage[] = [{ role: 'user', content: 'Hello' }]
      // @ts-expect-error: mock context
      await handleResponseMessages({ messages }, [{ role: 'assistant', content: 'Hi' }])
      expect(messages).toEqual([
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi' },
      ])
    })
  })

  describe('tool requests', () => {
    it('should call the tool when a tool request is received', async() => {
      const context = createContext(() => ({ ok: true }))
      await handleResponseMessages(context, [{ role: 'tool_request', id: 'tool-1', name: 'example', input: { value: 'Hello' } }])
      expect(context.tools[0].call).toHaveBeenCalledOnce()
      expect(context.tools[0].call).toHaveBeenCalledWith({ value: 'Hello' })
    })

    it('should push tool request and results to the messages', async() => {
      const thread = createThread()
      const messages: LanguageModelMessage[] = []
      const tools = [{ name: 'example', call: vi.fn(() => ({ ok: true })) }]
      // @ts-expect-error: mock context
      await handleResponseMessages({ messages, tools, thread }, [{ role: 'tool_request', id: 'tool-1', name: 'example', input: { value: 'Hello' } }])
      expect(messages).toEqual([
        { role: 'tool_request', id: 'tool-1', name: 'example', input: { value: 'Hello' } },
        { role: 'tool_result', id: 'tool-1', isError: false, result: { ok: true } },
      ])
    })

    it('should push tool request and errors to the messages', async() => {
      const thread = createThread()
      const messages: LanguageModelMessage[] = []
      const tools = [{ name: 'example', call: vi.fn(() => { throw new Error('Tool error') }) }]
      // @ts-expect-error: mock context
      await handleResponseMessages({ messages, tools, thread }, [{ role: 'tool_request', id: 'tool-1', name: 'example', input: { value: 'Hello' } }])
      expect(messages).toEqual([
        { role: 'tool_request', id: 'tool-1', name: 'example', input: { value: 'Hello' } },
        { role: 'tool_result', id: 'tool-1', isError: true, result: { error: 'Tool error' } },
      ])
    })
  })

  describe('multiple tool requests', () => {
    it('should call multiple tools and push the results next to the requests', async() => {
      const thread = createThread()
      const messages: LanguageModelMessage[] = []
      const tools = [
        { name: 'example_1', call: vi.fn(() => ({ value: 1 })) },
        { name: 'example_2', call: vi.fn(() => ({ value: 2 })) },
      ]
      // @ts-expect-error: mock context
      await handleResponseMessages({ messages, tools, thread }, [
        { role: 'tool_request', id: 'tool-1', name: 'example_1', input: { value: '1' } },
        { role: 'tool_request', id: 'tool-2', name: 'example_2', input: { value: '2' } },
      ])
      expect(tools[0].call).toHaveBeenCalledOnce()
      expect(tools[0].call).toHaveBeenCalledWith({ value: '1' })
      expect(tools[1].call).toHaveBeenCalledOnce()
      expect(tools[1].call).toHaveBeenCalledWith({ value: '2' })
      expect(messages).toEqual([
        { role: 'tool_request', id: 'tool-1', name: 'example_1', input: { value: '1' } },
        { role: 'tool_result', id: 'tool-1', isError: false, result: { value: 1 } },
        { role: 'tool_request', id: 'tool-2', name: 'example_2', input: { value: '2' } },
        { role: 'tool_result', id: 'tool-2', isError: false, result: { value: 2 } },
      ])
    })

    it('should push tool request and errors to the messages', async() => {
      const thread = createThread()
      const messages: LanguageModelMessage[] = []
      const tools = [
        { name: 'example_1', call: vi.fn(() => ({ ok: true })) },
        { name: 'example_2', call: vi.fn(() => { throw new Error('Tool error') }) },
      ]
      // @ts-expect-error: mock context
      await handleResponseMessages({ messages, tools, thread }, [
        { role: 'tool_request', id: 'tool-1', name: 'example_1', input: { value: '1' } },
        { role: 'tool_request', id: 'tool-2', name: 'example_2', input: { value: '2' } },
      ])
      expect(tools[0].call).toHaveBeenCalledOnce()
      expect(tools[0].call).toHaveBeenCalledWith({ value: '1' })
      expect(tools[1].call).toHaveBeenCalledOnce()
      expect(tools[1].call).toHaveBeenCalledWith({ value: '2' })
      expect(messages).toEqual([
        { role: 'tool_request', id: 'tool-2', name: 'example_2', input: { value: '2' } },
        { role: 'tool_result', id: 'tool-2', isError: true, result: { error: 'Tool error' } },
        { role: 'tool_request', id: 'tool-1', name: 'example_1', input: { value: '1' } },
        { role: 'tool_result', id: 'tool-1', isError: false, result: { ok: true } },
      ])
    })
  })

  describe('mixed messages', () => {
    it('should push text messages and tool requests to the messages', async() => {
      const thread = createThread()
      const messages: LanguageModelMessage[] = []
      const tools = [{ name: 'example', call: vi.fn(() => ({ ok: true })) }]
      // @ts-expect-error: mock context
      await handleResponseMessages({ messages, tools, thread }, [
        { role: 'assistant', content: 'Hello' },
        { role: 'tool_request', id: 'tool-1', name: 'example', input: {} },
      ])
      expect(messages).toEqual([
        { role: 'assistant', content: 'Hello' },
        { role: 'tool_request', id: 'tool-1', name: 'example', input: {} },
        { role: 'tool_result', id: 'tool-1', isError: false, result: { ok: true } },
      ])
    })
  })

  describe('edge cases', () => {
    it('should throw when trying to push a message with an user role', async() => {
      // @ts-expect-error: mock context
      const shouldReject = handleResponseMessages({}, [{ role: 'user', content: 'Hello' }])
      await expect(shouldReject).rejects.toThrow('Invalid message role: user')
    })

    it('should throw when trying to push a message with an invalid role', async() => {
      // @ts-expect-error: mock context
      const shouldReject = handleResponseMessages({}, [{ role: 'invalid', content: 'Hello' }])
      await expect(shouldReject).rejects.toThrow('Invalid message role: invalid')
    })
  })
})
function createContext(...calls: Array<(...args: any[]) => any>) {
  const thread = createThread()
  const component = defineComponent({})
  const nodeId = addNode(thread, 'example', { component })
  const tools = calls.map(call => defineTool({
    nodeId,
    name: 'tool-name',
    description: 'Tool description',
    properties: {},
    call,
  }))
  return { thread, nodeId, tools } as LanguageModelRequestContext
}

describe('onResponseRequestTool', () => {

  beforeEach(() => {
    vi.useFakeTimers({ now: new Date('2020-01-01T00:00:00Z') })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('result', () => {
    it('should call the tool and return the result', async() => {
      const context = createContext(() => ({ ok: true }))
      const result = await onResponseRequestTool(context, { id: 'call-id', name: 'tool-name', input: { value: 'Hello' } })
      expect(result).toEqual({ ok: true })
    })
  })

  describe('edge cases', () => {
    it('should throw an error if no tools are provided', async() => {
      const context = createContext()
      const shouldReject = onResponseRequestTool(context, { id: 'call-id', name: 'tool-name', input: { value: 'Hello' } })
      const error = E.INFERENCE_ON_RESPONSE_TOOL_REQUEST_MISSING_TOOLS()
      await expect(shouldReject).rejects.toThrowError(error)
    })

    it('should throw an error if the tool is not found', async() => {
      const context = createContext(() => ({ ok: true }))
      const shouldReject = onResponseRequestTool(context, { id: 'call-id', name: 'other-tool', input: { value: 'Hello' } })
      const error = E.INFERENCE_ON_RESPONSE_TOOL_REQUEST_TOOL_NOT_FOUND('other-tool')
      await expect(shouldReject).rejects.toThrowError(error)
    })

    it('should throw if the tool call fails', async() => {
      const context = createContext(() => { throw new Error('Tool error') })
      const shouldReject = onResponseRequestTool(context, { id: 'call-id', name: 'tool-name', input: { value: 'Hello' } })
      await expect(shouldReject).rejects.toThrow('Tool error')
    })
  })

  describe('events', () => {
    it('should dispatch the "nodeToolRequest" event when requesting a tool', async() => {
      const context = createContext(() => ({ ok: true }))
      const callback = vi.fn()
      context.thread.on('nodeToolRequest', callback)
      await onResponseRequestTool(context, { id: 'call-id', name: 'tool-name', input: { value: 'Hello' } })
      expect(callback).toHaveBeenCalledOnce()
      expect(callback).toHaveBeenCalledWith(
        context.nodeId,
        {
          id: 'call-id',
          name: 'tool-name',
          description: 'Tool description',
          parameters: { value: 'Hello' },
        },
        {
          delta: 0,
          duration: 1577836800000,
          state: 'idle',
          timestamp: '2020-01-01T00:00:00.000Z',
        },
      )
    })

    it('should dispatch the "nodeToolResponse" event when receiving a tool result', async() => {
      const context = createContext(() => ({ ok: true }))
      const callback = vi.fn()
      context.thread.on('nodeToolResponse', callback)
      await onResponseRequestTool(context, { id: 'call-id', name: 'tool-name', input: { value: 'Hello' } })
      expect(callback).toHaveBeenCalledOnce()
      expect(callback).toHaveBeenCalledWith(
        context.nodeId,
        {
          id: 'call-id',
          result: { ok: true },
        },
        {
          delta: 0,
          duration: 1577836800000,
          state: 'idle',
          timestamp: '2020-01-01T00:00:00.000Z',
        },
      )
    })

    it('should dispatch the "nodeToolError" event when a tool call fails', async() => {
      const context = createContext(() => { throw new Error('Tool error') })
      const callback = vi.fn()
      context.thread.on('nodeToolError', callback)
      const shouldReject = onResponseRequestTool(context, { id: 'call-id', name: 'tool-name', input: { value: 'Hello' } })
      await expect(shouldReject).rejects.toThrow('Tool error')
      expect(callback).toHaveBeenCalledOnce()
      expect(callback).toHaveBeenCalledWith(
        context.nodeId,
        {
          id: 'call-id',
          error: new Error('Tool error'),
        },
        {
          delta: 0,
          duration: 1577836800000,
          state: 'idle',
          timestamp: '2020-01-01T00:00:00.000Z',
        },
      )
    })

    it('should not dispatch events if the tool is not found', async() => {
      const context = createContext(() => ({ ok: true }))
      const callback = vi.fn()
      context.thread.on('nodeToolRequest', callback)
      context.thread.on('nodeToolResponse', callback)
      context.thread.on('nodeToolError', callback)
      const shouldReject = onResponseRequestTool(context, { id: 'call-id', name: 'other-tool', input: { value: 'Hello' } })
      await expect(shouldReject).rejects.toThrowError()
      expect(callback).not.toHaveBeenCalled()
    })
  })
})
