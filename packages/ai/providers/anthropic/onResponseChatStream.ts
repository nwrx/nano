/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/todo-tag */
import type { ContentBlock, RawMessageStreamEvent } from '@anthropic-ai/sdk/resources'
import type { Chat } from '../../chat'
import { parseStreamEvents } from '../../utils'
import { toFinishReason } from './toFinishReason'

export async function onResponseChatStream(context: Chat.Context): Promise<void> {
  const { response, pushEvent } = context
  let chunkRemaining = ''
  const blockTypes = new Map<number, ContentBlock['type']>()

  if (!response) throw new Error('Expected the "response" property to be set on the context.')
  if (!response.body) throw new Error('No response body found for streaming request.')
  const reader = response.body.getReader()
  pushEvent({ type: 'stream-start', timestamp: new Date() })

  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    if (!value) continue

    const usage: Chat.Usage = {
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
    const { events, remaining } = parseStreamEvents<RawMessageStreamEvent>(chunkRemaining)
    chunkRemaining = remaining
    for (const event of events) {
      pushEvent({ type: 'raw', rawValue: event })

      // --- Handle message boundaries.
      if (event.type === 'message_start') {
        const { id, model: modelId } = event.message
        pushEvent({ type: 'response-metadata', id, modelId, timestamp: new Date() })
        usage.inputTokens = event.message.usage.input_tokens
        usage.outputTokens = event.message.usage.output_tokens
        usage.cachedInputTokens = event.message.usage.cache_read_input_tokens ?? 0
      }
      else if (event.type === 'message_delta') {
        usage.outputTokens ??= 0
        usage.outputTokens += event.usage.output_tokens ?? 0
        if (event.delta.stop_reason) {
          const finishReason = toFinishReason(event.delta.stop_reason)
          pushEvent({ type: 'finish', finishReason })
          pushEvent({ type: 'usage', usage })
        }
      }
      else if (event.type === 'message_stop') {
        break
      }

      // --- Handle block start events.
      else if (event.type === 'content_block_start') {
        blockTypes.set(event.index, event.content_block.type)
        if (event.content_block.type === 'text') {
          pushEvent({
            type: 'text-start',
            id: event.index.toString(),
          })
        }
        else if (event.content_block.type === 'thinking') {
          pushEvent({
            type: 'reasoning-start',
            id: event.index.toString(),
          })
        }
        else if (event.content_block.type === 'tool_use') {
          pushEvent({
            type: 'tool-input-start',
            id: event.index.toString(),
            toolCallId: event.content_block.id,
            toolName: event.content_block.name,
          })
        }
        else if (event.content_block.type === 'server_tool_use') {
          pushEvent({
            type: 'tool-input-start',
            id: event.index.toString(),
            toolCallId: event.content_block.id,
            toolName: event.content_block.name,
            providerExecuted: true,
          })
        }
        else if (event.content_block.type === 'web_search_tool_result') {
          pushEvent({
            type: 'tool-input-start',
            id: event.index.toString(),
            toolCallId: event.content_block.tool_use_id,
            toolName: 'web_search',
            providerExecuted: true,
          })
        }
      }

      // --- Handle block delta events.
      else if (event.type === 'content_block_delta') {
        if (event.delta.type === 'text_delta')
          pushEvent({ type: 'text-delta', id: event.index.toString(), delta: event.delta.text })
        else if (event.delta.type === 'thinking_delta')
          pushEvent({ type: 'reasoning-delta', id: event.index.toString(), delta: event.delta.thinking })
        else if (event.delta.type === 'input_json_delta')
          pushEvent({ type: 'tool-input-delta', id: event.index.toString(), delta: event.delta.partial_json })
      }

      // --- Handle block stop and map to the correct event type based
      // --- on previously stored block types.
      else if (event.type === 'content_block_stop') {
        const type = blockTypes.get(event.index)
        if (type === 'text')
          pushEvent({ type: 'text-end', id: event.index.toString() })
        else if (type === 'thinking')
          pushEvent({ type: 'reasoning-end', id: event.index.toString() })
        else if (type === 'tool_use' || type === 'server_tool_use' || type === 'web_search_tool_result')
          pushEvent({ type: 'tool-input-end', id: event.index.toString() })
      }

      // --- This is a ping event, which is used to keep the connection alive.
      // --- We can ignore it, as it does not contain any useful information.
      // @ts-expect-error: the `ping` event is not typed in `@anthropic-ai/sdk`
      else if (event.type === 'ping') {
        /* do nothing */
      }

      else {
        console.warn('unknown payload', event)
      }
    }
  }
}
