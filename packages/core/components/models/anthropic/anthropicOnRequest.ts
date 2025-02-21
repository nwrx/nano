import type { LanguageModelRequestContext } from '../../inference'
import type { Anthropic } from './types'
import { normalizeContent } from '../../inference'
import { anthropicNormalizeMessage } from './anthropicNormalizeMessage'

export async function anthropicOnRequest(context: LanguageModelRequestContext, token?: string): Promise<void> {

  // --- Adapt the `tools` to the Anthropic API request format.
  const tools = context.tools.map<Anthropic.Tool>(tool => ({
    name: tool.name,
    description: tool.description,
    input_schema: tool.parameters,
  }))

  // --- Adapt the messages to the Anthropic API request format.
  const messagePromises = context.messages
    .filter(message => message.role !== 'system')
    .map(message => anthropicNormalizeMessage(message))

  // --- The Anthropic API requires the system messages to be sent in a separate field.
  const systemPromises = context.messages
    .filter(message => message.role === 'system')
    .map(async message => ({
      type: 'text',
      text: await normalizeContent(message.content as string),
      cache_control: { type: 'ephemeral' },
    } as Anthropic.MessageSystem))

  // --- Mutate the `RequestInit` object before sending the request.
  context.method = 'POST'
  context.headers.set('x-api-key', token!)
  context.headers.set('anthropic-version', '2023-06-01')
  context.headers.set('content-type', 'application/json')
  context.body = {
    model: context.model,
    messages: await Promise.all(messagePromises),
    system: systemPromises.length > 0 ? await Promise.all(systemPromises) : undefined,

    // parameters
    top_k: context.parameters.topK,
    top_p: context.parameters.topP,
    stream: context.parameters.stream,
    temperature: context.parameters.temperature,
    max_tokens: context.parameters.maxCompletionTokens,
    stop_sequences: context.parameters.stopSequences,

    // tools
    tools: tools.length > 0 ? tools : undefined,
    tool_choice: tools.length > 0 ? { type: 'auto' } : undefined,
  } satisfies Anthropic.RequestBody
}
