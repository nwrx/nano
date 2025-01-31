/* eslint-disable sonarjs/cognitive-complexity */
import type { LanguageModelMessage, LanguageModelResponseContext } from '../../inference'
import type { OpenAI } from './types'
import { OPENAI_ERRORS as E } from './errors'
import { openaiParseStreamChunk } from './openaiParseStreamChunk'

export async function openaiOnResponseStream(context: LanguageModelResponseContext): Promise<void> {
  const { response, pushContent, pushMessages, pushMessageDelta, resume } = context
  if (!response.body) throw new Error('No response body found for streaming request.')
  const reader = response.body.getReader()

  let chunkRemaining = ''
  const receivedText = false
  const toolCalls = new Map<number, OpenAI.ToolCall>()

  while (true) {
    const { value, done } = await reader.read()
    if (done) break

    // --- Multiple chunks may arrive in a single payload. Decode and split them
    // --- by line to process each one individually and in order. This is necessary
    // --- because the chunks may be split at arbitrary points in the JSON.
    chunkRemaining += new TextDecoder('utf8').decode(value)
    const { payloads, remaining } = openaiParseStreamChunk(chunkRemaining)
    chunkRemaining = remaining
    for (const payload of payloads) {
      const { finish_reason, delta } = payload.choices[0]

      // --- Push text content to the output stream.
      if (typeof delta.content === 'string') {
        await pushContent(delta.content)
        if (receivedText) pushMessageDelta({ role: 'assistant', content: delta.content })
        else await pushMessages({ role: 'assistant', content: delta.content })
      }

      // --- Handle tool calls payload.
      else if (delta.tool_calls !== undefined) {
        for (const toolCall of delta.tool_calls) {
          if (toolCall.id === undefined) {
            const thisToolCall = toolCalls.get(toolCall.index)
            if (!thisToolCall) throw new Error('Tool call not found.')
            thisToolCall.function.arguments += toolCall.function.arguments
          }
          else {
            toolCalls.set(toolCall.index, toolCall)
          }
        }
      }

      // --- Handle the finish reasons.
      if (finish_reason === 'content_filter') {
        throw E.RESPONSE_CONTENT_FILTER('openai', delta.refusal)
      }
      else if (finish_reason === 'length') {
        throw E.RESPONSE_CONTEXT_WINDOW_OVERFLOW('openai')
      }
      else if (finish_reason === 'tool_calls') {
        resume()
        const messagesToPush = [...toolCalls].map(([,toolCall]) => ({
          role: 'tool_request',
          id: toolCall.id,
          name: toolCall.function.name,
          input: JSON.parse(toolCall.function.arguments) as Record<string, unknown>,
        }) as LanguageModelMessage)
        await pushMessages(...messagesToPush)
      }
    }
  }
}
