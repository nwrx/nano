import type { TextGeneration } from './types'
import { isUserContentLike } from './isUserContentLike'
import { normalizeUserContent } from './normalizeUserContent'

/**
 * Convert a `MessageLike` into a standardized `Message` object.
 *
 * This function takes various types of message content (string, number, boolean, File, Uint8Array, ReadableStream)
 * and converts them into a format suitable for text generation messages.
 *
 * @param messageLike The message content to normalize.
 * @returns A promise that resolves to a standardized message object.
 * @throws An error if the content type is unsupported.
 */
export async function normalizeMessage(messageLike: TextGeneration.MessageLike): Promise<TextGeneration.Message> {
  if (Array.isArray(messageLike)) {
    const promises = messageLike.map(x => normalizeUserContent(x))
    return { role: 'user', content: await Promise.all(promises) }
  }
  else if (isUserContentLike(messageLike)) {
    const content = await normalizeUserContent(messageLike)
    return { role: 'user', content: [content] }
  }
  else {
    return messageLike
  }
}
