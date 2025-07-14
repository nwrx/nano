import type { ContentBlockParam } from '@anthropic-ai/sdk/resources'
import type { Chat } from '../../chat'
import { toContentFromContentFile } from './toContentFromContentFile'

/**
 * Convert a `MessageUserContent` to an Anthropic message user content object.
 *
 * This function takes various types of message content (string, number, boolean, File, Uint8Array, ReadableStream)
 * and converts them into a format suitable for the Anthropic API.
 *
 * @param content The message content to normalize.
 * @returns A promise that resolves to an Anthropic message user content object.
 * @throws An error if the content type is unsupported.
 */
export function toContentFromUser(content: Chat.MessageUserContent): ContentBlockParam {
  if (content.type === 'text')
    return { type: 'text', text: content.text }
  else if (content.type === 'file')
    return toContentFromContentFile(content)
  else
    // @ts-expect-error: ignore
    throw new Error(`Unsupported message content type "${content.type}" in user message.`)
}
