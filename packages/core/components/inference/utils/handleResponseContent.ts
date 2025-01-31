export async function handleResponseContent(
  controller: ReadableStreamDefaultController<string>,
  content: ReadableStream<string> | string | string[],
): Promise<void> {
  if (typeof content === 'string') {
    controller.enqueue(content)
  }
  else if (Array.isArray(content)) {
    const text = content.join('')
    controller.enqueue(text)
  }
  else if (content instanceof ReadableStream) {
    const reader = content.getReader()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      controller.enqueue(value)
    }
  }
}
