import type { MessageParam } from '@anthropic-ai/sdk/resources'
import type { Chat } from '../../chat'
import { toContentFromAssistant } from './toContentFromAssistant'
import { toContentFromContentToolResult } from './toContentFromContentToolResult'
import { toContentFromUser } from './toContentFromUser'

export function toMessage(message: Chat.Message): MessageParam | undefined {
  if (message.role === 'user') {
    const content = message.content.map(x => toContentFromUser(x))
    return { role: 'user', content }
  }
  else if (message.role === 'assistant') {
    const content = message.content.map(x => toContentFromAssistant(x)).filter(x => x !== undefined)
    return { role: 'assistant', content }
  }
  else if (message.role === 'tool') {
    const content = message.content.map(x => toContentFromContentToolResult(x))
    return { role: 'user', content }
  }
  else if (message.role === 'system') {
    return undefined // Anthropic does not support system messages in the same way as other roles.
  }
  else {
    // @ts-expect-error: ignore
    throw new Error(`The message role "${message.role}" is not supported.`)
  }
}
