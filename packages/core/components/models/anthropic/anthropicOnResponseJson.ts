import type { LanguageModelMessage, LanguageModelResponseContext } from '../../inference'
import type { Anthropic } from './types'
import { ANTHROPIC_ERRORS as E } from './errors'

export async function anthropicOnResponseJson(context: LanguageModelResponseContext): Promise<void> {
  const { response, resume, pushMessages, pushContent } = context
  const { content, stop_reason } = await response.json() as Anthropic.ResponseBody
  const messagesToPush: LanguageModelMessage[] = []

  // --- Handle the stop reasons.
  if (stop_reason === 'max_tokens')
    throw E.RESPONSE_CONTEXT_WINDOW_OVERFLOW()
  if (stop_reason === 'tool_use')
    resume()

  // --- Iterate over the content and push content and collect tool calls.
  for (const message of content) {
    if (message.type === 'text') {
      messagesToPush.push({ role: 'assistant', content: message.text })
      await pushContent(message.text)
    }
    else if (message.type === 'tool_use') {
      messagesToPush.push({
        role: 'tool_request',
        id: message.id,
        name: message.name,
        input: message.input,
      })
    }
  }

  // --- Push the messages back to the context.
  await pushMessages(...messagesToPush)
}
