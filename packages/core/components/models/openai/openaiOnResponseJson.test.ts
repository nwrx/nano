import type { LanguageModelResponseContext } from '../../inference'
import type { OpenAI } from './types'
import { OPENAI_ERRORS as E } from './errors'
import { openaiOnResponseJson } from './openaiOnResponseJson'

function createContext(choice: Partial<OpenAI.Choice> = {}): LanguageModelResponseContext {
  return {
    response: { json: () => Promise.resolve({ choices: [choice] }) },
    pushContent: vi.fn(),
    pushMessages: vi.fn(),
    resume: vi.fn(),
  } as unknown as LanguageModelResponseContext
}

describe('openaiOnResponseJson', () => {
  describe('handle content', () => {
    it('should push content', async() => {
      const context = createContext({ finish_reason: 'stop', message: { role: 'assistant', content: 'Hello, world!' } })
      await openaiOnResponseJson(context)
      expect(context.pushContent).toHaveBeenCalledWith('Hello, world!')
    })

    it('should push messages', async() => {
      const context = createContext({ finish_reason: 'stop', message: { role: 'assistant', content: 'Hello, world!' } })
      await openaiOnResponseJson(context)
      expect(context.pushMessages).toHaveBeenCalledWith({ role: 'assistant', content: 'Hello, world!' })
    })
  })

  describe('handle tool calls', () => {
    it('should push tool calls messages', async() => {
      const context = createContext({
        finish_reason: 'tool_calls',
        message: {
          role: 'assistant',
          tool_calls: [{ id: 'tool_123', type: 'function', function: { name: 'example_tool', arguments: '{}' } }],
        },
      })
      await openaiOnResponseJson(context)
      expect(context.pushMessages).toHaveBeenCalledWith({
        role: 'tool_request',
        id: 'tool_123',
        name: 'example_tool',
        input: {},
      })
    })

    it('should push tool calls and assistant messages', async() => {
      const context = createContext({
        finish_reason: 'tool_calls',
        message: {
          role: 'assistant',
          content: 'Hello, world!',
          tool_calls: [{ id: 'tool_123', type: 'function', function: { name: 'example_tool', arguments: '{}' } }],
        },
      })
      await openaiOnResponseJson(context)
      expect(context.pushMessages).toHaveBeenCalledWith(
        { role: 'assistant', content: 'Hello, world!' },
        { role: 'tool_request', id: 'tool_123', name: 'example_tool', input: {} },
      )
    })

    it('should resume for tool calls finish reason', async() => {
      const context = createContext({
        finish_reason: 'tool_calls',
        message: {
          role: 'assistant',
          tool_calls: [{ id: 'tool_123', type: 'function', function: { name: 'example_tool', arguments: '{}' } }],
        },
      })
      await openaiOnResponseJson(context)
      expect(context.resume).toHaveBeenCalled()
    })
  })

  describe('handle error finish reasons', () => {
    it('should throw an error for content filter finish reason', async() => {
      const context = createContext({ finish_reason: 'content_filter', message: { role: 'assistant', refusal: 'The completion was stopped due to content filtering.' } })
      const shouldReject = openaiOnResponseJson(context)
      const error = E.RESPONSE_CONTENT_FILTER('openai', 'The completion was stopped due to content filtering.')
      await expect(shouldReject).rejects.toThrowError(error)
    })

    it('should throw an error for length finish reason', async() => {
      const context = createContext({ finish_reason: 'length' })
      const shouldReject = openaiOnResponseJson(context)
      const error = E.RESPONSE_CONTEXT_WINDOW_OVERFLOW('openai')
      await expect(shouldReject).rejects.toThrowError(error)
    })
  })
})
