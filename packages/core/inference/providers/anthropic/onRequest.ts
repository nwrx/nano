import type { MessageCreateParams, TextBlockParam, ToolUnion } from '@anthropic-ai/sdk/resources'
import type { TextGeneration } from '../../textGeneration'
import { toMessage } from './toMessage'

export function onRequest(context: TextGeneration.Context): void {
  const { request: options, init, messages } = context
  const { tools = [], model } = options

  // --- Adapt the `tools` to the Anthropic API request format.
  const normalizedTools = tools.map<ToolUnion>(tool => ({
    type: 'custom',
    name: tool.name,
    description: tool.description,
    input_schema: tool.inputSchema,
  }))

  // --- Adapt the messages to the Anthropic API request format.
  const allMessages = messages
    .map(message => toMessage(message))
    .filter(message => message !== undefined)

  // --- The Anthropic API requires the system messages to be sent in a separate field.
  const systemMessages = messages
    .filter(message => typeof message === 'object' && 'role' in message && message.role === 'system')
    .map<TextBlockParam>(message => ({ type: 'text', text: message.content }))

  // --- Mutate the `RequestInit` object before sending the request.
  init.method = 'POST'
  init.body = JSON.stringify({
    model,
    messages: allMessages,
    system: systemMessages.length > 0 ? systemMessages : undefined,
    max_tokens: 4096,
    tools: normalizedTools.length > 0 ? normalizedTools : undefined,
    tool_choice: normalizedTools.length > 0 ? { type: 'auto' } : undefined,

    // Additional parameters for the request will be handled by the adapter
    // and will be merged into the request body as needed.

  } satisfies MessageCreateParams)
}
