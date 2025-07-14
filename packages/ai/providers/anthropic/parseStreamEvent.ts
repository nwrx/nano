import type { RawMessageStreamEvent } from '@anthropic-ai/sdk/resources'

export interface ParsedStreamEvents {
  events: RawMessageStreamEvent[]
  remaining: string
}

export function parseStreamEvent(event: string): ParsedStreamEvents {
  const events: RawMessageStreamEvent[] = []
  let remaining = event.trimStart()

  while (true) {

    // --- Align the chunk to the beginning of the data.
    const eventStart = remaining.indexOf('event: ')
    if (eventStart === -1) break
    const start = remaining.indexOf('data: ', eventStart)
    if (start === -1) break
    const end = remaining.indexOf('\n', start)
    if (end === -1) break

    // --- Extract, parse, and store the payload.
    const json = remaining.slice(start + 6, end).trim()
    if (json === '[DONE]') break
    const data = JSON.parse(json) as RawMessageStreamEvent
    events.push(data)

    // --- Continue with the remaining data if any.
    remaining = remaining.slice(end + 2)
  }

  return { events, remaining }
}
