import type { Peer } from 'crossws'
import type { H3Event } from 'h3'
import { getCookie, getHeader, getRequestIP, isEvent } from 'h3'

export interface EventInformation {
  token?: string
  address?: string
  userAgent?: string
}

export interface GetEventInformationOptions {
  cookieName: string
  trustProxy: boolean
}

/**
 * Adapter function to get the address and user agent from either an `H3Event` or a `Peer`.
 * This allows us to use the same function to get the information weather we are in an HTTP
 * route or a WebSocket route.
 *
 * @param event The event to get the information from.
 * @param options The options to get the information with.
 * @returns The address and user agent from the event.
 */
export function getEventInformation(event: H3Event | Peer, options: GetEventInformationOptions): EventInformation {
  const { cookieName, trustProxy } = options
  const result: EventInformation = {}

  // --- If the event is an H3 event, extract the address and user agent from the request.
  if (isEvent(event)) {
    result.token = getCookie(event, cookieName)
    result.address = getRequestIP(event, { xForwardedFor: trustProxy }) ?? undefined
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
    result.token = cookies[cookieName]
    result.address = (trustProxy ? headers.get('X-Forwarded-For') : undefined) ?? event.remoteAddress
    result.userAgent = headers.get('User-Agent') ?? undefined
  }

  // --- Return the event information.
  return result
}
