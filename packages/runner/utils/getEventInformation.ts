import type { Peer } from 'crossws'
import type { H3Event } from 'h3'
import type { ModuleRunner } from '../application'
import { getHeader, getRequestHeader, getRequestIP, isEvent } from 'h3'

export interface EventInformation {
  token?: string
  address?: string
}

/**
 * Adapter function to get the address and user agent from either an `H3Event` or a `Peer`.
 * This allows us to use the same function to get the information weather we are in an HTTP
 * route or a WebSocket route.
 *
 * @param event The event to get the information from.
 * @returns The address and user agent from the event.
 */
export function getEventInformation(this: ModuleRunner, event: H3Event | Peer) {
  const result: EventInformation = {}

  // --- If the event is an H3 event, extract the address and user agent from the request.
  if (isEvent(event)) {
    result.token = getHeader(event, 'Authorization')?.replace(/^Bearer\s+/, '')
    result.address = this.runnerTrustProxy ? getRequestHeader(event, 'X-Forwarded-For') : getRequestIP(event)
  }

  // --- If the event is a peer, extract the address and user agent from the peer.
  else if (
    typeof event === 'object'
    && 'request' in event
    && typeof event.request === 'object'
    && 'url' in event.request
    && typeof event.request.url === 'string'
  ) {
    const headers = event.request.headers
    const authorization = headers.get('Authorization')
    result.token = authorization ? authorization.replace(/^Bearer\s+/, '') : new URL(event.request.url).searchParams.get('token') ?? undefined
    result.address = this.runnerTrustProxy ? headers.get('X-Forwarded-For')! : event.remoteAddress
  }

  // --- Return the event information.
  return result
}
