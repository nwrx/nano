import type { ModuleRunner } from '@nwrx/nano-runner'
import type { ChannelConnectOptions } from '@unserved/client'
import type { ServerErrorName } from '@unserved/server'
import type { WebSocketChannel } from '@unshared/client/websocket'
import type { ObjectLike } from '@unshared/types'
import type { Peer } from 'crossws'
import type { ThreadRunner } from '../entities'
import { createClient } from '@unserved/client'
import { createError } from '@unserved/server'
import { ERRORS } from './errors'

export type ThreadRunnerChannel = WebSocketChannel<ChannelConnectOptions<ModuleRunner, 'WS /threads/:id'>>

export interface ThreadRunnerClientOptions {
  address: string
  token?: string
  runner: ThreadRunner
}

export class ThreadRunnerClient {
  constructor(private options: ThreadRunnerClientOptions) {
    const { address, token } = options
    this.client.options.baseUrl = /^https?:\/\//.test(address) ? address : `http://${address}`
    this.client.options.headers = { Authorization: `Bearer ${token}` }
  }

  get address() {
    return this.options.address
  }

  get token() {
    return this.options.token
  }

  get runner() {
    return this.options.runner
  }

  /***************************************************************************/
  /* Polling                                                                 */
  /***************************************************************************/

  interval: NodeJS.Timeout | undefined

  startPolling() {
    this.interval = setInterval(() => {
      this.getStatus()
        .then((status) => { for (const peer of this.peers) peer.send(status) })
        .catch(() => { for (const peer of this.peers) peer.send({}) },
        )
    }, 100)
  }

  stopPolling() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = undefined
    }
  }

  /***************************************************************************/
  /* Subscriptions                                                           */
  /***************************************************************************/

  peers = new Set<Peer>()

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
  client = createClient<ModuleRunner>({
    onFailure: async(response) => {
      const data = await response.json() as { data: ObjectLike }
      throw createError({
        name: data.data.name as ServerErrorName,
        message: data.data.message as string,
        statusCode: response.status,
        statusMessage: response.statusText,
      })
    },
  })

  async claim(): Promise<{ token: string; identity: string }> {
    const { token, identity } = await this.client.request('POST /claim').catch((error: TypeError) => {
      // @ts-expect-error: The error object has a `code` property.
      const code = error.cause.code as string
      throw code ? ERRORS.THREAD_RUNNER_NOT_REACHABLE(this.address, code) : error
    })
    this.options.token = token
    this.client.options.headers = { Authorization: `Bearer ${token}` }
    return { token, identity }
  }

  async release() {
    await this.client.request('POST /release')
    this.client.options.headers = {}
  }

  async ping() {
    await this.client.request('GET /ping')
  }

  async getStatus() {
    return await this.client.request('GET /status')
  }
}

export function createThreadRunnerClient(options: ThreadRunnerClientOptions) {
  return new ThreadRunnerClient(options)
}
