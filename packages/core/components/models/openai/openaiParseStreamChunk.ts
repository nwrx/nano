import type { OpenAI } from './types'

export interface OpenAIParseStreamChunkResult {
  payloads: OpenAI.StreamPayload[]
  remaining: string
}

export function openaiParseStreamChunk(chunk: string): OpenAIParseStreamChunkResult {
  const payloads: OpenAI.StreamPayload[] = []
  let remaining = chunk.trimStart()

  while (true) {

    // --- Align the chunk to the beginning of the payload.
    const start = remaining.indexOf('data:')
    if (start === -1) break
    const end = remaining.indexOf('\n', start)
    if (end === -1) break

    // --- Extract, parse, and store the payload.
    const json = remaining.slice(start + 6, end)
    if (json === '[DONE]') break
    const data = JSON.parse(json) as OpenAI.StreamPayload
    payloads.push(data)

    // --- Continue with the remaining data if any.
    remaining = remaining.slice(end + 1)
  }

  return { payloads, remaining }
}
