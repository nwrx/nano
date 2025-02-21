import type { FlowV1 } from '@nwrx/nano'
import type { ModuleRunner } from '@nwrx/nano-runner'
import type { ChannelConnectOptions } from '@unserved/client'
import type { ServerErrorName } from '@unserved/server'
import type { WebSocketChannel } from '@unshared/client/websocket'
import type { ObjectLike } from '@unshared/types'
import { createClient } from '@unserved/client'
import { createError } from '@unserved/server'
import { ERRORS } from './errors'

export type ThreadRunnerChannel = WebSocketChannel<ChannelConnectOptions<ModuleRunner, 'WS /threads/:id'>>

export class ThreadRunner {
  constructor(public address: string, public token = '') {
    this.client.options.baseUrl = /^https?:\/\//.test(address) ? address : `http://${address}`
    this.client.options.headers = { Authorization: `Bearer ${token}` }
  }

  /**
   * The hybrid HTTP/WebSocket client that will be used to communicate with the
   * thread runner. This client will be used to make authenticated requests to
   * the thread runner.
   */
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

  /**
   * Claims the thread runner by requesting a token from the server. This will
   * allow the API to make authenticated requests to the thread runner. Note that
   * this effectively locks the thread runner to the API instance, meaning that
   * no other API instance can claim the thread runner.
   *
   * @returns The token of the thread runner that was claimed.
   * @example await threadRunner.claim() // -> '00000000-0000-0000-0000-000000000000'
   */
  async claim(): Promise<{ token: string; identity: string }> {
    const { token, identity } = await this.client.request('POST /claim').catch((error: TypeError) => {
      // @ts-expect-error: The error object has a `code` property.
      const code = error.cause.code as string
      throw code ? ERRORS.THREAD_RUNNER_NOT_REACHABLE(this.address, code) : error
    })
    this.token = token
    this.client.options.headers = { Authorization: `Bearer ${token}` }
    return { token, identity }
  }

  /**
   * Releases the thread runner by revoking the token that was claimed. This will
   * allow the thread runner to be claimed by another API instance. Note that this
   * will also stop all threads that are currently running on the thread runner.
   *
   * @example await threadRunner.release()
   */
  async release() {
    await this.client.request('POST /release')
    this.token = ''
    this.client.options.headers = {}
  }

  /**
   * Pings the thread runner to check if it is alive. Additionally, this will
   * check if the thread runner is authenticated.
   *
   * @returns An object with the `ok` property set to `true`.
   * @example await threadRunner.ping() // { ok: true }
   */
  async ping() {
    await this.client.request('GET /ping')
  }

  /**
   * Gets the status of the thread runner. This will return information about the
   * worker pool and the number of workers in the pool.
   *
   * @returns An object with the worker pool information.
   * @example await threadRunner.getStatus() // { ... }
   */
  async getStatus() {
    return await this.client.request('GET /status')
  }

  /**
   * Create a new thread by connecting through WebSocket to the thread runner
   * and sending the flow to run. This will return the ID of the thread that was
   * created.
   *
   * @param flow The flow to run in the thread.
   * @returns A thread object with methods to start and abort the thread.
   */
  async createThread(flow: FlowV1): Promise<ThreadRunnerChannel> {
    const { id } = await this.client.request('POST /threads', { data: { flow } })
    return await this.client.connect('WS /threads/:id', {
      parameters: { id },
      query: { token: this.token },
      autoReconnect: true,
      reconnectDelay: 300,
      reconnectLimit: 3,
    })
  }
}

export function createThreadRunner(address: string): ThreadRunner {
  return new ThreadRunner(address)
}
