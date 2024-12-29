export type LanguageModelMessageContent = any[] | boolean | File | number | object | ReadableStream<string | Uint8Array> | string

/**
 * Since not all LLM provider accepts the same type of content, this function normalizes the content to a string.
 *
 * @param content The content to normalize.
 * @returns The normalized content as a string.
 */
export async function normalizeContent(content: LanguageModelMessageContent): Promise<string> {

  // --- Return the file's content as a Base64 string.
  if (content instanceof File) {
    const bytes = await content.arrayBuffer()
    const buffer = Buffer.from(bytes)
    return buffer.toString('base64')
  }

  // --- Return the stream's content as a string.
  else if (content instanceof ReadableStream) {
    const reader = content.getReader()
    let result = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      result += typeof value === 'string' ? value : new TextDecoder().decode(value)
    }
    return result
  }

  else if (typeof content === 'object' && content !== null) {
    return JSON.stringify(content)
  }

  else if (typeof content === 'string') {
    return content
  }

  else if (typeof content === 'number') {
    return content.toString()
  }

  else if (typeof content === 'boolean') {
    return content.toString()
  }

  throw new TypeError('The content type is not supported.')
}
