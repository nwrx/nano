import type { LanguageModelMessage } from '../../inference'
import type { OpenAI } from './types'
import { normalizeContent } from '../../inference'

export async function openaiNormalizeMessage(message: LanguageModelMessage | string): Promise<OpenAI.Message> {
  if (typeof message === 'string') {
    return {
      role: 'user',
      content: message,
    }
  }
  if (message.role === 'user' || message.role === 'assistant' || message.role === 'system') {
    return {
      role: message.role,
      content: await normalizeContent(message.content) || 'null',
    }
  }
  if (message.role === 'tool_request') {
    return {
      role: 'assistant',
      tool_calls: [{
        id: message.id,
        type: 'function',
        function: {
          name: message.name,
          arguments: JSON.stringify(message.input),
        },
      }],
    }
  }
  if (message.role === 'tool_result') {
    return {
      role: 'tool',
      content: await normalizeContent(message.result),
      tool_call_id: message.id,
    }
  }
  throw new Error(`The message role "${message.role as string}" is not supported.`)
}
