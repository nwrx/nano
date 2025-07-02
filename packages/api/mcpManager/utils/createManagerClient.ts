import type { ServerErrorName } from '@unserved/server'
import type { Peer } from 'crossws'
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
  peers = new Set<Peer>()

  startPolling() {
    this.interval = setInterval(() => {
      this.getStatus()
        .then((status) => { for (const peer of this.peers) peer.send(status) })
        .catch(() => { for (const peer of this.peers) peer.send({}) },
        )
    }, 1000)
  }

  stopPolling() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = undefined
    }
  }

  subscribe(peer: Peer) {
    this.peers.add(peer)
    if (this.interval === undefined) this.startPolling()
  }

  unsubscribe(peer: Peer) {
    this.peers.delete(peer)
    if (this.peers.size === 0) this.stopPolling()
  }

  /***************************************************************************/
  /* Client                                                                  */
  /***************************************************************************/

  client = createClient<NmcpManager.Schema>({
    onFailure: async(response) => {
      const data = await response.text()
      try {
        const error = JSON.parse(data) as NmcpManager.Error
        throw createError(error)
      }
      catch {
        throw createError({
          name: toConstantCase('E_MCP_MANAGER', response.statusText) as ServerErrorName,
          message: data,
          statusCode: response.status,
          statusMessage: response.statusText,
        })
      }
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
    return await this.client.request('GET /api/v1/pools/{name}', {
      parameters: { name },
    }) as Promise<NmcpManager.Pool>
  }

  async createPool(options?: NmcpManager.CreatePoolOptions): Promise<NmcpManager.Pool> {
    return await this.client.request('POST /api/v1/pools', {
      body: options,
    })
  }

  async updatePool(name: string, options?: NmcpManager.PatchPoolOptions): Promise<NmcpManager.PatchPoolResult> {
    return await this.client.request('PUT /api/v1/pools/{name}', {
      parameters: { name },
      body: options,
    }) as Promise<NmcpManager.PatchPoolResult>
  }

  async deletePool(name: string): Promise<void> {
    await this.client.request('DELETE /api/v1/pools/{name}', {
      parameters: { name },
    })
  }

  async poolExists(name: string): Promise<boolean> {
    const response = await this.client.fetch('GET /api/v1/pools/{name}', { parameters: { name } })
    return response.status === 200
  }

  /***************************************************************************/
  /* Servers                                                                 */
  /***************************************************************************/

  async getServer(name: string): Promise<NmcpManager.Server> {
    return await this.client.request('GET /api/v1/servers/{name}', {
      parameters: { name },
    }) as Promise<NmcpManager.Server>
  }

  async createServer(options?: NmcpManager.CreateServerOptions): Promise<NmcpManager.Server> {
    return await this.client.request('POST /api/v1/servers', {
      body: options,
    })
  }

  async updateServer(name: string, options?: NmcpManager.UpdateServerOptions): Promise<NmcpManager.Server> {
    return await this.client.request('PUT /api/v1/servers/{name}', {
      parameters: { name },
      body: options,
    }) as Promise<NmcpManager.Server>
  }

  async deleteServer(name: string): Promise<void> {
    await this.client.request('DELETE /api/v1/servers/{name}', {
      parameters: { name },
    })
  }

  async serverExists(name: string): Promise<boolean> {
    const response = await this.client.fetch('GET /api/v1/servers/{name}', { parameters: { name } })
    return response.status === 200
  }
}

export function createManagerClient(gateway: McpManager): McpManagerClient {
  return new McpManagerClient(gateway)
}
