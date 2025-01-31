import type { LanguageModelRequestContext } from '../../inference'
import type { OpenAI } from './types'
import { openaiNormalizeMessage } from './openaiNormalizeMessage'

export async function openaiOnRequest(data: LanguageModelRequestContext, token?: string): Promise<void> {

  // --- Adapt the `tools` to the OpenAI API request format.
  const tools = data.tools.map<OpenAI.Tool>(tool => ({
    type: 'function',
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
    },
  }))

  // --- Adapt the messages to the OpenAI API request format.
  const messagePromises = data.messages
    .map(message => openaiNormalizeMessage(message))

  // --- Mutate the `RequestInit` object before sending the request.
  data.method = 'POST'
  data.headers.set('content-Type', 'application/json')
  data.headers.set('authorization', `Bearer ${token}`)
  data.body = {
    model: data.model,
    messages: await Promise.all(messagePromises),

    // parameters
    n: 1,
    seed: data.parameters.seed,
    top_p: data.parameters.topP,
    stream: data.parameters.stream,
    temperature: data.parameters.temperature,
    frequency_penalty: data.parameters.frequencyPenalty,
    max_completion_tokens: data.parameters.maxCompletionTokens,

    // tools
    tools: tools.length > 0 ? tools : undefined,
    tool_choice: tools.length > 0 ? 'auto' : undefined,
    parallel_tool_calls: tools.length > 0 ? data.parameters.allowParallelToolCalls : undefined,
  } satisfies OpenAI.RequestBody
}
