import type { EventStream, ServerErrorName } from '@unserved/server'
import type { McpManager } from '../entities'
import type { NmcpManager } from './types'
import { createError } from '@unserved/server'
import { createClient } from '@unshared/client'
import { toConstantCase } from '@unshared/string'
import { ERRORS } from './errors'

export class McpManagerClient {
  constructor(gateway: McpManager) {
    const { address } = gateway
    this.client.options.baseUrl = /^https?:\/\//.test(address) ? address : `http://${address}`
  }

  /***************************************************************************/
  /* Subscriptions                                                           */
  /***************************************************************************/

  /** The interval for polling the thread runner status. */
  interval: NodeJS.Timeout | undefined

  /** The set of subscribed peers. */
  peers = new Set<EventStream<NmcpManager.Status>>()

  startPolling() {
    this.interval = setInterval(() => {
      this.getStatus()
        .then((status) => {
          for (const peer of this.peers)
            void peer.sendMessage(status)
        })
        .catch(() => {})
    }, 1000)
  }

  stopPolling() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = undefined
    }
  }

  subscribe(peer: EventStream<NmcpManager.Status>) {
    this.peers.add(peer)
    if (this.interval === undefined) this.startPolling()
    peer.h3EventStream.onClosed(() => this.unsubscribe(peer))
  }

  unsubscribe(peer: EventStream<NmcpManager.Status>) {
    this.peers.delete(peer)
    if (this.peers.size === 0) this.stopPolling()
  }

  /***************************************************************************/
  /* Client                                                                  */
  /***************************************************************************/

  client = createClient<NmcpManager.Schema>({
    onFailure: async(response) => {
      const text = await response.text()
      let data: NmcpManager.Error | undefined
      try { data = JSON.parse(text) as NmcpManager.Error }
      catch { /* ignore */ }
      throw createError({
        name: data?.name ?? toConstantCase('E_MCP_MANAGER', response.statusText) as ServerErrorName,
        message: data?.message ?? text,
        statusCode: data?.statusCode ?? response.status,
        statusMessage: data?.statusMessage ?? response.statusText,
      })
    },
  })

  async ping(): Promise<void> {
    return await this.client.request('GET /health/ping').catch((error: Error) => {
      if (error.message === 'fetch failed') {
        const address = this.client.options.baseUrl!
        const message = error.message
        throw ERRORS.MCP_MANAGER_NOT_REACHABLE(address, message)
      }
      throw error
    })
  }

  async getStatus(): Promise<NmcpManager.Status> {
    return await this.client.request('GET /health/status').catch((error: Error) => {
      if (error.message === 'fetch failed') {
        const address = this.client.options.baseUrl!
        const message = error.message
        throw ERRORS.MCP_MANAGER_NOT_REACHABLE(address, message)
      }
      throw error
    })
  }

  /***************************************************************************/
  /* Pools                                                                   */
  /***************************************************************************/

  async getPool(name: string): Promise<NmcpManager.Pool> {
    return await this.client.request('GET /v1/pools/{name}', {
      parameters: { name },
    }) as NmcpManager.Pool
  }

  async createPool(options?: NmcpManager.CreatePoolOptions): Promise<NmcpManager.Pool> {
    return await this.client.request('POST /v1/pools', {
      body: options,
    }) as NmcpManager.Pool
  }

  async updatePool(name: string, options?: NmcpManager.PatchPoolOptions): Promise<NmcpManager.PatchPoolResult> {
    return await this.client.request('PUT /v1/pools/{name}', {
      parameters: { name },
      body: options,
    }) as NmcpManager.PatchPoolResult
  }

  async deletePool(name: string): Promise<void> {
    await this.client.request('DELETE /v1/pools/{name}', {
      parameters: { name },
    })
  }

  async poolExists(name: string): Promise<boolean> {
    const response = await this.client.fetch('GET /v1/pools/{name}', { parameters: { name } })
    return response.status === 200
  }

  /***************************************************************************/
  /* Servers                                                                 */
  /***************************************************************************/

  async getServer(name: string): Promise<NmcpManager.Server> {
    return await this.client.request('GET /v1/servers/{name}', {
      parameters: { name },
    }).catch((error: Error) => {
      if (error.message === 'fetch failed') {
        const address = this.client.options.baseUrl!
        const message = error.message
        throw ERRORS.MCP_MANAGER_NOT_REACHABLE(address, message)
      }
      throw error
    }) as NmcpManager.Server
  }

  async createServer(options?: NmcpManager.CreateServerOptions): Promise<NmcpManager.Server> {
    return await this.client.request('POST /v1/servers', {
      body: options,
    }) as NmcpManager.Server
  }

  async updateServer(name: string, options?: NmcpManager.UpdateServerOptions): Promise<NmcpManager.Server> {
    return await this.client.request('PUT /v1/servers/{name}', {
      parameters: { name },
      body: options,
    }) as NmcpManager.Server
  }

  async deleteServer(name: string): Promise<void> {
    await this.client.request('DELETE /v1/servers/{name}', {
      parameters: { name },
    })
  }

  async serverExists(name: string): Promise<boolean> {
    const response = await this.client.fetch('GET /v1/servers/{name}', { parameters: { name } })
    return response.status === 200
  }
}

export function createManagerClient(gateway: McpManager): McpManagerClient {
  return new McpManagerClient(gateway)
}
