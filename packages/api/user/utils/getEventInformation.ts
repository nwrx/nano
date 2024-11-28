import type { Peer } from 'crossws'
import type { H3Event } from 'h3'
import type { ModuleUser } from '../index'
import { getCookie, getHeader, getRequestIP, isEvent } from 'h3'

export interface EventInformation {
  token?: string
  address?: string
  userAgent?: string
}

/**
 * Adapter function to get the address and user agent from either an `H3Event` or a `Peer`.
 * This allows us to use the same function to get the information weather we are in an HTTP
 * route or a WebSocket route.
 *
 * @param event The event to get the information from.
 * @returns The address and user agent from the event.
 */
export function getEventInformation(this: ModuleUser, event: H3Event | Peer) {
  const result: EventInformation = {}

  // --- If the event is an H3 event, extract the address and user agent from the request.
  if (isEvent(event)) {
    result.token = getCookie(event, this.userSessionCookieName)
    result.address = getRequestIP(event, { xForwardedFor: this.userTrustProxy })
    result.userAgent = getHeader(event, 'User-Agent')
  }

  // --- If the event is a peer, extract the address and user agent from the peer.
  else if (
    typeof event === 'object'
    && 'request' in event
    && typeof event.request === 'object'
    && 'headers' in event.request
    && typeof event.request.headers === 'object'
  ) {
    const headers = event.request.headers
    const cookiesValue = headers.get('cookie') ?? ''
    const cookiesEntries = cookiesValue.split(';').map(x => x.trim().split('=').map(x => x.trim()))
    const cookies = Object.fromEntries(cookiesEntries) as Record<string, string>
    result.token = cookies[this.userSessionCookieName]
    result.userAgent = headers.get('User-Agent') ?? undefined
    result.address = this.userTrustProxy ? headers.get('X-Forwarded-For')! : event.remoteAddress
  }

  // --- Return the event information.
  return result
}
