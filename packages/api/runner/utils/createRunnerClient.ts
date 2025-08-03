import type { ModuleRunner } from '@nwrx/nano-runner'
import type { ChannelConnectOptions } from '@unserved/client'
import type { ServerErrorName } from '@unserved/server'
import type { WebSocketChannel } from '@unshared/client/websocket'
import type { ObjectLike } from '@unshared/types'
import type { Peer } from 'crossws'
import type { Runner } from '../entities'
import { createClient } from '@unserved/client'
import { createError } from '@unserved/server'
import { toConstantCase } from '@unshared/string'
import { ERRORS } from './errors'

export type RunnerChannel = WebSocketChannel<ChannelConnectOptions<ModuleRunner, 'WS /threads/:id'>>

export interface RunnerClientOptions {
  address: string
  token?: string
  runner: Runner
}

export class RunnerClient {
  constructor(private options: RunnerClientOptions) {
    const { address, token } = options
    this.client.options.baseUrl = address
    this.client.options.headers = { Authorization: `Bearer ${token}` }
  }

  set address(address: string) {
    this.options.address = address
    this.client.options.baseUrl = address
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
  client = createClient<ModuleRunner>({
    onFailure: async(response) => {
      const data = await response.json() as { data?: ObjectLike }
      const name = data.data
        ? (data.data.name as ServerErrorName)
        : `E_${toConstantCase(response.statusText)}` as ServerErrorName
      const message: string = data.data ? (data.data.message as string) : response.statusText
      throw createError({
        name,
        message,
        statusCode: response.status,
        statusMessage: response.statusText,
      })
    },
  })

  async claim(): Promise<{ token: string; identity: string }> {
    const { token, identity } = await this.client.request('POST /claim')
      .catch((error: TypeError) => {
        // @ts-expect-error: `code` is not always present in the error.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const message: string = error.cause?.code ?? error.message
        throw ERRORS.THREAD_RUNNER_NOT_REACHABLE(this.address, message)
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

export function createRunnerClient(options: RunnerClientOptions) {
  return new RunnerClient(options)
}
