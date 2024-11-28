import { H3Event } from 'h3'
import { IncomingMessage, ServerResponse } from 'node:http'
import { Socket } from 'node:net'

interface Options {
  method?: string
  headers?: Record<string, string>
  remoteAddress?: string
}

/**
 * Create a mock H3 event for testing.
 *
 * @param options The options to create the event with.
 * @returns The created H3 event.
 */
export function createEvent(options: Options) {
  const { headers = {}, method = 'GET', remoteAddress = '0.0.0.0' } = options

  // --- Override the read-only `remoteAddress` property of the socket.
  const socket = new Proxy(new Socket(), {
    get(target, property) {
      if (property === 'remoteAddress') return remoteAddress
      return Reflect.get(target, property) as unknown
    },
  })

  // --- Create a new H3 event with the given options.
  const request = new IncomingMessage(socket)
  const response = new ServerResponse(request)
  request.headers = headers
  request.method = method

  // --- Return the created event.
  return new H3Event(request, response)
}
