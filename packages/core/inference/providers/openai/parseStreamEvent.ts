import type { ChatCompletionChunk } from 'openai/resources'

export interface ParsedStreamEvents {
  events: ChatCompletionChunk[]
  remaining: string
}

export function parseStreamEvent(event: string): ParsedStreamEvents {
  const events: ChatCompletionChunk[] = []
  let remaining = event.trimStart()

  while (true) {

    // --- Align the chunk to the beginning of the payload.
    const start = remaining.indexOf('data:')
    if (start === -1) break
    const end = remaining.indexOf('\n', start)
    if (end === -1) break

    // --- Extract, parse, and store the payload.
    const json = remaining.slice(start + 6, end)
    if (json === '[DONE]') break
    const data = JSON.parse(json) as ChatCompletionChunk
    events.push(data)

    // --- Continue with the remaining data if any.
    remaining = remaining.slice(end)
  }

  return { events, remaining }
}
