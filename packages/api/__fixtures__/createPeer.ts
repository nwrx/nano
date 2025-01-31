import type { Peer } from 'crossws'

interface Options {
  headers?: Record<string, string>
  remoteAddress?: string
}

/**
 * Create a mock `crossws` Peer for testing.
 *
 * @param options The options to create the event with.
 * @returns The created H3 event.
 */
export function createPeer(options: Options): Peer {
  const { headers = {}, remoteAddress = '0.0.0.0' } = options
  const request = new Request('http://localhost', { headers })
  return { request, remoteAddress } as Peer
}
