import type { Anthropic } from './types'

export interface AnthropicParseStreamChunkResult {
  payloads: Anthropic.Chunk[]
  remaining: string
}

export function anthropicParseStreamChunk(chunk: string): AnthropicParseStreamChunkResult {
  const payloads: Anthropic.Chunk[] = []
  let remaining = chunk.trimStart()

  while (true) {

    // --- Align the chunk to the beginning of the data.
    const eventStart = remaining.indexOf('event: ')
    if (eventStart === -1) break
    const start = remaining.indexOf('data: ', eventStart)
    if (start === -1) break
    const end = remaining.indexOf('\n', start)
    if (end === -1) break

    // --- Extract, parse, and store the payload.
    const json = remaining.slice(start + 6, end)
    const data = JSON.parse(json) as Anthropic.Chunk
    payloads.push(data)

    // --- Continue with the remaining data if any.
    remaining = remaining.slice(end + 2)
  }

  return { payloads, remaining }
}
