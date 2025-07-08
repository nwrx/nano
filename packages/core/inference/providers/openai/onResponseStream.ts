/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/todo-tag */
import type { TextGeneration } from '../../textGeneration'
import { parseStreamEvent } from './parseStreamEvent'
import { toFinishReason } from './toFinishReason'

export async function onResponseStream(context: TextGeneration.Context): Promise<void> {
  const { response, pushEvent, pendingMessages } = context
  let chunkRemaining = ''
  let firstChunk = true

  if (!response) throw new Error('Expected the "response" property to be set on the context.')
  if (!response.body) throw new Error('No response body found for streaming request.')
  const reader = response.body.getReader()
  pushEvent({ type: 'stream-start', timestamp: new Date() })

  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    if (!value) continue

    const usage: Required<TextGeneration.Usage> = {
      cachedInputTokens: 0,
      inputTokens: 0,
      outputTokens: 0,
      reasoningTokens: 0,
      get totalTokens() {
        return (this.inputTokens ?? 0)
          + (this.outputTokens ?? 0)
          + (this.reasoningTokens ?? 0)
          + (this.cachedInputTokens ?? 0)
      },
    }

    // --- Multiple chunks may arrive in a single payload. Decode and split them
    // --- by line to process each one individually and in order. This is necessary
    // --- because the chunks may be split at arbitrary points in the JSON.
    chunkRemaining += new TextDecoder('utf8').decode(value)

    const { events, remaining } = parseStreamEvent(chunkRemaining)
    chunkRemaining = remaining
    for (const event of events) {
      pushEvent({ type: 'raw', rawValue: event })

      // --- Handle OpenAI streaming events
      if (event.object !== 'chat.completion.chunk')
        continue

      // --- Handle initial metadata event
      if (firstChunk) {
        firstChunk = false
        pushEvent({ type: 'response-metadata', id: event.id, modelId: event.model, timestamp: new Date() })
      }
      // Process each choice
      for (const choice of event.choices) {
        const { delta, finish_reason, index } = choice

        // --- Handle text content deltas. Since there is no `start` event, we need
        // --- to detect if this is the first delta for this response's choice.
        if (delta.content) {
          const id = `text_${event.id}_${index}`
          const pending = pendingMessages.get(id)
          if (!pending) pushEvent({ type: 'text-start', id })
          pushEvent({ type: 'text-delta', id, delta: delta.content })
        }

        // --- Handle tool call input deltas. Same treatment as text deltas.
        if (delta.tool_calls && delta.tool_calls.length > 0) {
          for (const toolCall of delta.tool_calls) {
            const id = `tool_${event.id}_${index}`
            const pending = pendingMessages.get(id)
            const toolName = toolCall.function?.name ?? ''
            const delta = toolCall.function?.arguments ?? ''
            if (!pending) pushEvent({ type: 'tool-input-start', id, toolName })
            pushEvent({ type: 'tool-input-delta', id, delta })
          }
        }

        // --- If there are pending messages, finalize them by sending the end event
        // --- for each pending message. Then, clear the pending messages and push
        // --- the finish event.
        if (finish_reason) {
          for (const [id, pending] of pendingMessages.entries()) {
            if (pending.type === 'text') pushEvent({ type: 'text-end', id })
            if (pending.type === 'tool') pushEvent({ type: 'tool-input-end', id })
          }
          const finishReason = toFinishReason(finish_reason)
          pushEvent({ type: 'finish', finishReason })
        }
      }

      // --- Update usage information if available
      if (event.usage) {
        usage.inputTokens += event.usage.prompt_tokens ?? 0
        usage.outputTokens += event.usage.completion_tokens ?? 0
        usage.cachedInputTokens += event.usage.prompt_tokens_details?.cached_tokens ?? 0
        usage.reasoningTokens += event.usage.completion_tokens_details?.reasoning_tokens ?? 0
        pushEvent({ type: 'usage', usage })
      }
    }
  }
}
