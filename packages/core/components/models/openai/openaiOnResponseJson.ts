import type { LanguageModelMessage, LanguageModelResponseContext } from '../../inference'
import type { OpenAI } from './types'
import { OPENAI_ERRORS as E } from './errors'

export async function openaiOnResponseJson(context: LanguageModelResponseContext): Promise<void> {
  const { response, pushContent, pushMessages, resume } = context
  const { choices: [{ finish_reason, message }] } = await response.json() as OpenAI.ResponseBody
  const messagesToPush: LanguageModelMessage[] = []

  // --- Handle the finish reasons.
  if (finish_reason === 'content_filter')
    throw E.RESPONSE_CONTENT_FILTER('openai', message.refusal)
  else if (finish_reason === 'length')
    throw E.RESPONSE_CONTEXT_WINDOW_OVERFLOW('openai')
  else if (finish_reason === 'tool_calls')
    resume()

  // --- Push the completion text to the context.
  if (message.content !== undefined) {
    messagesToPush.push({ role: 'assistant', content: message.content })
    await pushContent(message.content)
  }

  // --- Push the tool calls to the messages.
  if (message.tool_calls !== undefined) {
    for (const toolCall of message.tool_calls) {
      messagesToPush.push({
        role: 'tool_request',
        id: toolCall.id,
        name: toolCall.function.name,
        input: JSON.parse(toolCall.function.arguments) as Record<string, unknown>,
      })
    }
  }

  // --- Push the messages to the context.
  await pushMessages(...messagesToPush)
}
