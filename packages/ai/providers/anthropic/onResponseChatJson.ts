import type { Message } from '@anthropic-ai/sdk/resources/messages.mjs'
import type { Chat } from '../../chat'
import { toFinishReason } from './toFinishReason'

export async function onResponseChatJson(context: Chat.Context): Promise<void> {
  const { response, pushEvent } = context
  if (!response) throw new Error('Expected the "response" property to be set on the context.')
  const message = await response.json() as Message

  // --- Push the response metadata event.
  pushEvent({
    type: 'response-metadata',
    id: message.id,
    modelId: message.model,
    timestamp: new Date(),
  })

  // --- Push message content as events.
  for (const content of message.content) {
    if (content.type === 'thinking') {
      pushEvent({ type: 'reasoning-start', id: message.id })
      pushEvent({ type: 'reasoning-delta', id: message.id, delta: content.thinking })
      pushEvent({ type: 'reasoning-end', id: message.id })
    }
    // else if (message.type === 'web_search_tool_result') {
    //   pushEvent({ type: 'tool-result', toolCallId: message.tool_use_id, toolName: 'web_search', output: message.content })
    // }
    else if (content.type === 'text') {
      pushEvent({ type: 'text-start', id: message.id })
      pushEvent({ type: 'text-delta', delta: content.text, id: message.id })
      pushEvent({ type: 'text-end', id: message.id })
    }
    else if (content.type === 'server_tool_use' || content.type === 'tool_use') {
      const providerExecuted = content.type === 'server_tool_use'
      pushEvent({ type: 'tool-input-start', id: message.id, toolName: content.name, providerExecuted })
      pushEvent({ type: 'tool-input-delta', id: message.id, delta: JSON.stringify(content.input, undefined, 2) })
      pushEvent({ type: 'tool-input-end', id: message.id })
    }
  }

  // --- Push the finish and usage events.
  pushEvent({ type: 'finish', finishReason: toFinishReason(message.stop_reason) })
  pushEvent({
    type: 'usage',
    usage: {
      inputTokens: message.usage?.input_tokens,
      outputTokens: message.usage?.output_tokens,
      reasoningTokens: 0,
      cachedInputTokens: message.usage?.cache_read_input_tokens ?? 0,
      get totalTokens() {
        return (this.inputTokens ?? 0)
          + (this.outputTokens ?? 0)
          + (this.reasoningTokens ?? 0)
          + (this.cachedInputTokens ?? 0)
      },
    },
  })
}
