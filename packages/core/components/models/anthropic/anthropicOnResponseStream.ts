/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/todo-tag */
import type { LanguageModelResponseContext } from '../../inference'
import type { Anthropic } from './types'
import { anthropicParseStreamChunk } from './anthropicParseStreamChunk'

export async function anthropicOnResponseStream(context: LanguageModelResponseContext): Promise<void> {
  const { response, pushContent, pushMessages, pushMessageDelta, resume } = context
  if (!response.body) throw new Error('No response body found for streaming request.')
  const reader = response.body.getReader()

  let chunkRemaining = ''
  const blocks = new Map<number, Anthropic.ChunkContentBlockStart>()
  const toolInputs = new Map<number, string>()

  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    if (!value) continue

    // --- Multiple chunks may arrive in a single payload. Decode and split them
    // --- by line to process each one individually and in order. This is necessary
    // --- because the chunks may be split at arbitrary points in the JSON.
    chunkRemaining += new TextDecoder('utf8').decode(value)
    const { payloads, remaining } = anthropicParseStreamChunk(chunkRemaining)
    chunkRemaining = remaining
    for (const payload of payloads) {

      // --- Handle message boundaries
      if (payload.type === 'message_start') {
        /* Do nothing */
      }
      else if (payload.type === 'message_delta') {
        if (payload.delta.stop_reason === 'tool_use') resume()
      }
      else if (payload.type === 'message_stop') {
        break
      }

      // --- Handle block start
      else if (payload.type === 'content_block_start') {
        blocks.set(payload.index, payload)
        if (payload.content_block.type === 'text') {
          await pushContent(payload.content_block.text)
          await pushMessages({ role: 'assistant', content: payload.content_block.text })
        }
        else if (payload.content_block.type === 'tool_use') {
          toolInputs.set(payload.index, '')
        }
      }

      // --- Handle block delta
      else if (payload.type === 'content_block_delta') {
        const block = blocks.get(payload.index)
        if (!block) throw new Error('Received content_block_delta without a content_block_start')

        // --- Append the delta content to the current text block.
        if (block.content_block.type === 'text' && payload.delta.type === 'text_delta') {
          await pushContent(payload.delta.text)
          pushMessageDelta({ role: 'assistant', content: payload.delta.text })
          block.content_block.text += payload.delta.text
        }

        // --- Append the delta JSON to the current tool_use block.
        if (block.content_block.type === 'tool_use' && payload.delta.type === 'input_json_delta') {
          const input = toolInputs.get(payload.index)
          if (input === undefined) throw new Error('Received input_json_delta without a tool_use block')
          toolInputs.set(payload.index, input + payload.delta.partial_json)
        }
      }

      // --- Handle block stop
      else if (payload.type === 'content_block_stop') {
        const block = blocks.get(payload.index)
        if (!block) {
          throw new Error('Received content_block_stop without a content_block_start')
        }
        else if (block.content_block.type === 'text') {
          /* Do nothing */
        }
        else if (block.content_block.type === 'tool_use') {
          const input = toolInputs.get(payload.index)
          if (input === undefined) throw new Error('Received content_block_stop without a tool_use block')
          await pushMessages({
            role: 'tool_request',
            id: block.content_block.id,
            name: block.content_block.name,
            input: JSON.parse(input) as Record<string, unknown>,
          })
        }
      }
      else if (payload.type === 'ping') {
        /* Do nothing */
      }
      else {
        console.log('unknown payload', payload)
      }
    }
  }
}
