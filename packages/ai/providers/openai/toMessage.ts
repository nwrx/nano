import type { ChatCompletionMessageParam, ChatCompletionMessageToolCall } from 'openai/resources'
import type { Chat } from '../../chat'
import { toContentFromUser } from './toContentFromUser'

export function toMessage(message: Chat.Message): ChatCompletionMessageParam | undefined {
  if (message.role === 'user') {
    return {
      role: 'user',
      content: message.content.map(x => toContentFromUser(x)),
      name: undefined,
    }
  }
  else if (message.role === 'assistant') {
    const content = convertAssistantContent(message.content)
    const tool_calls = getToolCalls(message.content)
    return {
      role: 'assistant',
      content: content ?? undefined,
      tool_calls: tool_calls.length > 0 ? tool_calls : undefined,
      name: undefined,
    }
  }
  else if (message.role === 'system') {
    return {
      role: 'system',
      name: undefined,
      content: message.content,
    }
  }
  else if (message.role === 'tool') {
    const toolResults = message.content.filter(c => c.type === 'tool-result')
    if (toolResults.length === 0) return undefined
    const toolResult = toolResults[0]
    const content = convertToolResultContent(toolResult)
    return {
      role: 'tool',
      content,
      tool_call_id: toolResult.toolCallId,
    }
  }
  else {
    // @ts-expect-error: ignore
    throw new Error(`The message role "${message.role}" is not supported.`)
  }
}

function convertAssistantContent(content: Chat.MessageAssistantContent[]): string | undefined {
  const textParts: string[] = []
  for (const item of content) {
    if (item.type === 'text') {
      textParts.push(item.text)
    }
    else if (item.type === 'reasoning') {
      // Include reasoning text as part of content - OpenAI doesn't have separate reasoning
      textParts.push(`[Reasoning: ${item.text}]`)
    }
    // Skip tool-call and tool-result content as they're handled separately
  }
  return textParts.length > 0 ? textParts.join('\n') : undefined
}

function getToolCalls(content: Chat.MessageAssistantContent[]): ChatCompletionMessageToolCall[] {
  const toolCalls: ChatCompletionMessageToolCall[] = []
  for (const item of content) {
    if (item.type === 'tool-call') {
      toolCalls.push({
        id: item.toolCallId,
        type: 'function',
        function: {
          name: item.toolName,
          arguments: JSON.stringify(item.input),
        },
      })
    }
  }
  return toolCalls
}

function convertToolResultContent(toolResult: Chat.ContentToolResult): string {
  const outputs: string[] = []

  for (const output of toolResult.output) {
    if (output.type === 'text') {
      outputs.push(output.value)
    }
    else if (output.type === 'json') {
      outputs.push(JSON.stringify(output.value))
    }
    else if (output.type === 'error-text') {
      outputs.push(`Error: ${output.value}`)
    }
    else if (output.type === 'error-json') {
      outputs.push(`Error: ${JSON.stringify(output.value)}`)
    }
    else if (output.type === 'content') {
      const contentTexts = output.value
        .filter(v => v.type === 'text')
        .map(v => v.text)
      outputs.push(...contentTexts)
    }
  }

  return outputs.join('\n')
}
