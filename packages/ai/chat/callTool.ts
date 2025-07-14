import type { Chat } from './types'

/**
 * Executes a tool call in the chat context.
 * This function finds the tool by its name, checks if it has an execute method,
 * and then calls it with the provided input.
 *
 * @param context The chat context containing messages and available tools.
 * @param content The content of the tool call, including the tool name, input, and tool call ID.
 * @returns A promise that resolves when the tool call is executed and the result is added to the messages.
 */
export async function callTool(context: Chat.Context, content: Chat.ContentToolCall): Promise<void> {
  const { messages, request: { tools = [] } } = context

  // --- Find the tool and assert it has an execute method.
  const tool = tools.find(tool => tool.name === content.toolName)
  if (!tool) throw new Error(`Tool "${content.toolName}" not found in the options.`)
  if (!tool.call) throw new Error(`Tool "${content.toolName}" does not have an execute method.`)
  if (content.providerExecuted) throw new Error(`Tool "${content.toolName}" was already executed by the provider.`)

  // --- Push the tool call to the messages array.
  let contentToolResult: Chat.ContentToolResult
  try {
    const result = await tool.call(content.input as Record<string, unknown>)
    contentToolResult = {
      type: 'tool-result',
      toolName: content.toolName,
      toolCallId: content.toolCallId,
      output: [
        typeof result === 'string'
          ? { type: 'text', value: result }
          : { type: 'json', value: result as Record<string, unknown> },
      ],
    }
  }
  catch (error) {
    contentToolResult = {
      type: 'tool-result',
      toolName: content.toolName,
      toolCallId: content.toolCallId,
      output: [{ type: 'error-text', value: error instanceof Error ? error.message : String(error) }],
    }
  }
  messages.push(
    { role: 'assistant', content: [content] },
    { role: 'tool', content: [contentToolResult] },
  )
}
