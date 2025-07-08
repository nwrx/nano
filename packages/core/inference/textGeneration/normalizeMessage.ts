import type { TextGeneration } from './types'

/**
 * Check if a value is a user content-like object.
 *
 * This function checks if the provided value is one of the supported types for user content,
 * which includes string, number, boolean, File, Uint8Array, or ReadableStream.
 *
 * @param value The value to check.
 * @returns True if the value is a user content-like object, false otherwise.
 */
function isUserContentLike(value: unknown): value is TextGeneration.MessageContentUserLike {
  return (
    typeof value === 'string'
    || typeof value === 'number'
    || typeof value === 'boolean'
    || value instanceof File
    || value instanceof Uint8Array
    || (value instanceof ReadableStream && value.getReader !== undefined)
  )
}

/**
 * Convert a `MessageContentUserLike` into a standardized `MessageUserContent` object.
 *
 * This function takes various types of user content (string, number, boolean, File, Uint8Array, ReadableStream)
 * and converts them into a format suitable for message user content.
 *
 * @param content The user content to normalize.
 * @returns A promise that resolves to a standardized message user content object.
 * @throws An error if the content type is unsupported.
 */
async function normalizeUserContent(content: TextGeneration.MessageContentUserLike): Promise<TextGeneration.MessageUserContent> {

  // --- Stringify primitive types and wrap in a `ContentText` object.
  if (typeof content === 'string' || typeof content === 'number' || typeof content === 'boolean') {
    return {
      type: 'text',
      text: typeof content === 'string' ? content : String(content),
    }
  }

  // --- Handle Uint8Array as text.
  else if (content instanceof Uint8Array) {
    return {
      type: 'text',
      text: new TextDecoder().decode(content),
    }
  }

  // --- Handle File objects by reading them as binary data and wrap
  // --- in a `ContentFile` object with Base64 encoding.
  else if (content instanceof File) {
    const bytes = await content.arrayBuffer()
    const buffer = Buffer.from(bytes)
    return {
      type: 'file',
      name: content.name,
      mediaType: content.type,
      data: buffer.toString('base64'),
    }
  }

  // --- Handle ReadableStream by reading it and converting to text.
  else if (content instanceof ReadableStream) {
    const decoder = new TextDecoder()
    const reader = content.getReader()
    const chunks: string[] = []
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = typeof value === 'string' ? value : decoder.decode(value, { stream: true })
        chunks.push(chunk)
      }
      const eoq = decoder.decode()
      chunks.push(eoq)
    }
    finally {
      reader.releaseLock()
    }
    return {
      type: 'text',
      text: chunks.join(''),
    }
  }

  // --- Otherwise, throw an error for unsupported types.
  else {
    throw new TypeError(`Unsupported user content type "${typeof content}". Only string, number, boolean, File, Uint8Array, and ReadableStream are supported.`)
  }
}

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
