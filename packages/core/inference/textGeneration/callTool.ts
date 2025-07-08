import type { TextGeneration } from './types'

export async function callTool(context: TextGeneration.Context, content: TextGeneration.ContentToolCall): Promise<void> {
  const { messages, request: { tools = [] } } = context
  const tool = tools.find(tool => tool.name === content.toolName)
  if (!tool) throw new Error(`Tool "${content.toolName}" not found in the options.`)
  if (!tool.call) throw new Error(`Tool "${content.toolName}" does not have an execute method.`)
  if (content.providerExecuted) throw new Error(`Tool "${content.toolName}" was already executed by the provider.`)

  // --- Push the tool call to the messages array.
  let contentToolResult: TextGeneration.ContentToolResult
  try {
    const result = await tool.call(content.input as Record<string, unknown>)
    contentToolResult = {
      type: 'tool-result',
      toolName: content.toolName,
      toolCallId: content.toolCallId,
      output: [typeof result === 'string'
        ? { type: 'text', value: result }
        : { type: 'json', value: result }],
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
