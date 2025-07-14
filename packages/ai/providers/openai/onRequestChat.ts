import type { ChatCompletionCreateParams, ChatCompletionTool } from 'openai/resources'
import type { Chat } from '../../chat'
import { toMessage } from './toMessage'

export function onRequestChat(context: Chat.Context): void {
  const { request, init, messages } = context
  const { tools = [], model } = request

  // --- Adapt the `tools` to the Anthropic API request format.
  const normalizedTools = tools.map<ChatCompletionTool>(tool => ({
    type: 'function',
    function: {
      name: tool.name,
      description: tool.description,
      parameters: { ...tool.inputSchema, type: 'object', additionalProperties: false },
      strict: true,
    },
  }))

  // --- Adapt the messages to the Anthropic API request format.
  const allMessages = messages
    .map(message => toMessage(message))
    .filter(message => message !== undefined)

  // --- Mutate the `RequestInit` object before sending the request.
  init.method = 'POST'
  init.body = JSON.stringify({
    model,
    messages: allMessages,
    tools: normalizedTools.length > 0 ? normalizedTools : undefined,
    tool_choice: normalizedTools.length > 0 ? 'auto' : undefined,
    parallel_tool_calls: normalizedTools.length > 0 ? true : undefined,
    stream_options: { include_usage: true },
  } satisfies ChatCompletionCreateParams)
}
