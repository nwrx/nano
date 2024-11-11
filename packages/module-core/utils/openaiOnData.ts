import type { InferenceResult } from '../nodes'
import type { LanguageModelOnDataContext } from '../types'
import type { OpenaiChatRequest } from './OpenaiChatRequest'
import type { OpenaiChatResponse } from './OpenaiChatResponse'

export async function openaiOnData(
  context: LanguageModelOnDataContext<OpenaiChatRequest, OpenaiChatResponse>,
): Promise<InferenceResult | void> {
  const { body, data, call, resume } = context
  const { choices: [choice], id, usage } = data as unknown as OpenaiChatResponse

  // --- Handle tool calls returned by the model.
  if (choice.finish_reason === 'tool_calls') {
    if (choice.message.role !== 'assistant') throw new Error('The assistant message was not provided.')
    if (!choice.message.tool_calls) throw new Error('The tool calls were not provided.')
    const toolResultPromises = choice.message.tool_calls.map(async(toolCall) => {
      const name = toolCall.function.name
      const parameters = JSON.parse(toolCall.function.arguments) as Record<string, unknown>
      const result = await call(name, parameters)
      body.messages.push(choice.message, {
        role: 'tool',
        content: JSON.stringify(result),
        tool_call_id: toolCall.id,
      })
    })
    await Promise.all(toolResultPromises)
    return resume()
  }

  // --- Stop the completion.
  if (choice.finish_reason === 'stop') {
    if (choice.message.role !== 'assistant') throw new Error('The assistant message was not provided.')
    const completion = Array.isArray(choice.message.content) ? choice.message.content.join('\n') : choice.message.content
    return {
      id,
      completion: completion ?? '',
      tokensTotal: usage.total_tokens,
      tokensPrompt: usage.prompt_tokens,
      tokensCompletion: usage.completion_tokens,
    }
  }
}
