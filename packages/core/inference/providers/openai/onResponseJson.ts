import type { ChatCompletion } from 'openai/resources'
import type { TextGeneration } from '../../textGeneration'
import { toFinishReason } from './toFinishReason'

export async function onResponseJson(context: TextGeneration.Context): Promise<void> {
  const { response, pushEvent } = context
  if (!response) throw new Error('Expected the "response" property to be set on the context.')
  const message = await response.json() as ChatCompletion

  // --- Push the response metadata event.
  pushEvent({
    type: 'response-metadata',
    id: message.id,
    modelId: message.model,
    timestamp: new Date(),
  })

  // --- Push message content as events.
  for (const choice of message.choices) {
    if (choice.message.tool_calls) {
      for (const toolCall of choice.message.tool_calls) {
        pushEvent({ type: 'tool-input-start', id: message.id, toolName: toolCall.function.name })
        pushEvent({ type: 'tool-input-delta', id: message.id, delta: JSON.stringify(toolCall.function.arguments) })
        pushEvent({ type: 'tool-input-end', id: message.id })
      }
    }

    if (choice.message.content) {
      pushEvent({ type: 'text-start', id: message.id })
      pushEvent({ type: 'text-delta', delta: choice.message.content, id: message.id })
      pushEvent({ type: 'text-end', id: message.id })
    }
  }

  // --- Push the finish event.
  const messageFinishReason = message.choices.find(c => c.finish_reason)?.finish_reason
  const finishReason = toFinishReason(messageFinishReason)
  pushEvent({ type: 'finish', finishReason })

  // --- Push the usage event with token counts.
  pushEvent({
    type: 'usage',
    usage: {
      inputTokens: message.usage?.prompt_tokens ?? 0,
      outputTokens: message.usage?.completion_tokens ?? 0,
      reasoningTokens: 0, // OpenAI does not provide reasoning tokens
      cachedInputTokens: 0,
      get totalTokens() {
        return (this.inputTokens ?? 0)
          + (this.outputTokens ?? 0)
          + (this.reasoningTokens ?? 0)
          + (this.cachedInputTokens ?? 0)
      },
    },
  })
}
