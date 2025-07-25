import type { EventStream, ServerErrorName } from '@unserved/server'
import type { ObjectLike } from '@unshared/types'
import type { McpGateway } from '../entities'
import type { NmcpGateway } from './types'
import { createError } from '@unserved/server'
import { createClient } from '@unshared/client'
import { toConstantCase } from '@unshared/string/toConstantCase'
import { ERRORS } from './errors'

export class McpGatewayClient {
  constructor(gateway: McpGateway) {
    const { address } = gateway
    this.client.options.baseUrl = address
  }

  client = createClient<NmcpGateway.Schema>({
    onFailure: async(response) => {
      const text = await response.text()
      let data: NmcpGateway.Error | undefined
      try { data = JSON.parse(text) as NmcpGateway.Error }
      catch { /* ignore */ }
      throw createError({
        name: data?.name ?? toConstantCase('E_MCP_GATEWAY', response.statusText) as ServerErrorName,
        message: data?.message ?? text,
        statusCode: data?.statusCode ?? response.status,
        statusMessage: data?.statusMessage ?? response.statusText,
      })
    },
  })

  /***************************************************************************/
  /* Subscriptions                                                           */
  /***************************************************************************/

  /** The interval for polling the thread runner status. */
  interval: NodeJS.Timeout | undefined

  /** The set of subscribed peers. */
  peers = new Set<EventStream<NmcpGateway.Status>>()

  startPolling(): void {
    this.interval = setInterval(() => {
      this.getStatus()
        .then((status) => { for (const peer of this.peers) void peer.sendMessage(status) })
        .catch(() => {},
        )
    }, 1000)
  }

  stopPolling(): void {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = undefined
    }
  }

  subscribe(peer: EventStream<NmcpGateway.Status>): void {
    this.peers.add(peer)
    if (this.interval === undefined) this.startPolling()
  }

  unsubscribe(peer: EventStream<NmcpGateway.Status>): void {
    this.peers.delete(peer)
    if (this.peers.size === 0) this.stopPolling()
  }

  /***************************************************************************/
  /* Client                                                                  */
  /***************************************************************************/

  async ping(): Promise<void> {
    return await this.client.request('GET /health/ping').catch((error: Error) => {
      if (error.message === 'fetch failed') {
        const address = this.client.options.baseUrl!
        const message = error.message
        throw ERRORS.MCP_GATEWAY_NOT_REACHABLE(address, message)
      }
      throw error
    })
  }

  async getStatus(): Promise<NmcpGateway.Status> {
    return await this.client.request('GET /health/status').catch((error: Error) => {
      if (error.message === 'fetch failed') {
        const address = this.client.options.baseUrl!
        const message = error.message
        throw ERRORS.MCP_GATEWAY_NOT_REACHABLE(address, message)
      }
      throw error
    })
  }

  getStream(name: string) {
    return this.client.request('GET /{name}/sse', {
      parameters: {
        name,
      },
    })
  }

  postMessage(name: string, sessionId: string, body: ObjectLike) {
    return this.client.request('POST /{name}/message', {
      parameters: { name },
      query: { sessionId },
      body,
    })
  }
}

export function createGatewayClient(gateway: McpGateway): McpGatewayClient {
  return new McpGatewayClient(gateway)
}
