import type { LanguageModelMessage } from '../../inference'
import type { Anthropic } from './types'
import { normalizeContent } from '../../inference/utils/normalizeContent'

export async function anthropicNormalizeMessage(message: LanguageModelMessage | string): Promise<Anthropic.Message> {
  if (typeof message === 'string') {
    return {
      role: 'user',
      content: message,
    }
  }

  if (message.role === 'user' || message.role === 'assistant') {
    return {
      role: message.role,
      content: await normalizeContent(message.content),
    }
  }
  if (message.role === 'tool_request') {
    return {
      role: 'assistant',
      content: [{
        type: 'tool_use',
        id: message.id,
        name: message.name,
        input: message.input,
      }],
    }
  }
  if (message.role === 'tool_result') {
    return {
      role: 'user',
      content: [{
        type: 'tool_result',
        tool_use_id: message.id,
        is_error: message.error ? true : false,
        content: message.error
          ? JSON.stringify({ error: message.error as string })
          : JSON.stringify(message.result),
      }],
    }
  }
  throw new Error(`The message role "${message.role}" is not supported.`)
}
