import type { Peer } from 'crossws'
import type { H3Event } from 'h3'
import type { ModuleRunner } from '../application'
import { getRequestHeader, isEvent } from 'h3'

export function authorize(this: ModuleRunner, event: H3Event | Peer): void {

  // --- If the event is an H3 event, extract the address and user agent from the request.
  if (isEvent(event)) {
    const token = getRequestHeader(event, 'Authorization')?.replace(/^Bearer\s+/, '')
    if (token !== this.token) throw this.errors.NOT_AUTHORIZED(this.name)
    return
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
    const token = authorization
      ? authorization.replace(/^Bearer\s+/, '')
      : new URL(event.request.url).searchParams.get('token') ?? undefined
    if (token !== this.token) throw this.errors.NOT_AUTHORIZED(this.name)
    return
  }

  // --- Fallback for unsupported event types.
  throw this.errors.NOT_AUTHORIZED(this.name)
}
