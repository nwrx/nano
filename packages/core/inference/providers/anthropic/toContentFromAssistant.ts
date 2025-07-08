/* eslint-disable sonarjs/todo-tag */
import type { ContentBlockParam } from '@anthropic-ai/sdk/resources'
import type { TextGeneration } from '../../textGeneration'

/**
 * Convert a `MessageAssistantContent` to an Anthropic message assistant content object.
 *
 * This function takes a `MessageAssistantContent` and converts it into a format suitable for the Anthropic API.
 *
 * @param content The message content to normalize.
 * @returns A promise that resolves to an Anthropic message assistant content object.
 * @throws An error if the content type is unsupported.
 */

export function toContentFromAssistant(content: TextGeneration.MessageAssistantContent): ContentBlockParam | undefined {
  if (content.type === 'text') {
    return { type: 'text', text: content.text }
  }
  else if (content.type === 'reasoning') {
    console.warn('Reasoning content is not yet supported in assistant messages. Ignoring.')
    return undefined // TODO: handle reasoning in assistant messages
  }
  else if (content.type === 'file') {
    console.warn('File content is not yet supported in assistant messages. Ignoring.')
    return undefined // TODO: handle files in assistant messages
  }
  else if (content.type === 'tool-result') {
    console.warn('Tool result content is not yet supported in assistant messages. Ignoring.')
    return undefined // TODO: handle remote tool results in assistant messages
  }
  else if (content.type === 'tool-call') {
    return {
      type: 'tool_use',
      id: content.toolCallId,
      name: content.toolName,
      input: content.input,
    }
  }
  // @ts-expect-error: ignore
  throw new Error(`Unsupported message content type "${content.type}" in assistant message.`)
}
