import type { Chat } from './types'

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
export async function toUserContent(content: Chat.MessageContentUserLike): Promise<Chat.MessageUserContent> {

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
