export interface ParsedStreamEvents<T> {
  events: T[]
  remaining: string
}

export function parseStreamEvents<T>(event: string): ParsedStreamEvents<T> {
  const events: T[] = []
  let remaining = event.trimStart()

  while (true) {

    // --- Align the chunk to the beginning of the payload.
    const start = remaining.indexOf('data:')
    if (start === -1) break
    const end = remaining.indexOf('\n', start)
    if (end === -1) break

    // --- Extract, parse, and store the payload.
    const json = remaining.slice(start + 6, end).trim()
    if (json === '[DONE]') break
    const data = JSON.parse(json) as T
    events.push(data)

    // --- Continue with the remaining data if any.
    remaining = remaining.slice(end)
    if (remaining.trim() === '') break
  }

  return { events, remaining }
}
