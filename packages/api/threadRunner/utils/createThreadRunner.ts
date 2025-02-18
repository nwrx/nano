import type { FlowV1, ThreadInputObject } from '@nwrx/nano'
import type { ModuleRunner } from '@nwrx/nano-runner'
import type { ServerErrorName } from '@unserved/server'
import type { ObjectLike } from '@unshared/types'
import { createClient } from '@unserved/client'
import { createError } from '@unserved/server'

export class ThreadRunner {
  constructor(
    public baseUrl: string,
    public token = '',
  ) {
    this.client.options.baseUrl = baseUrl
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
  async claim(): Promise<string> {
    const { token } = await this.client.request('POST /claim')
    this.client.options.headers = { Authorization: `Bearer ${token}` }
    return token
  }

  /**
   * Pings the thread runner to check if it is alive. Additionally, this will
   * check if the thread runner is authenticated.
   *
   * @returns An object with the `ok` property set to `true`.
   * @example await threadRunner.ping() // { ok: true }
   */
  async ping() {
    return await this.client.request('GET /ping')
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
   * @param data The flow to run in the thread.
   * @returns A thread object with methods to start and abort the thread.
   */
  async createThread(data: FlowV1) {
    const channel = await this.client.connect('WS /threads', {
      autoReconnect: true,
      reconnectDelay: 1000,
      reconnectLimit: 10,
      initialPayload: { event: 'create', data },
    })

    // --- Wait for the thread worker to be ready.
    await new Promise<void>((resolve, reject) => {
      channel.on('error', reject)
      channel.on('message', (message) => {
        if (message.event === 'error') reject(message.data[0])
        if (message.event === 'worker:ready') resolve()
      })
    })

    return {
      channel,

      async start(data: ThreadInputObject = {}): Promise<ObjectLike> {
        this.channel.send({ event: 'start', data })
        return await new Promise<ObjectLike>((resolve, reject) => {
          this.channel.on('message', (message) => {
            if (message.event === 'error') reject(message.data[0])
            if (message.event === 'done') resolve(message.data[0])
          })
        })
      },

      async abort() {
        this.channel.send({ event: 'abort' })
        return await new Promise<void>((resolve, reject) => {
          this.channel.on('message', (message) => {
            if (message.event === 'error') reject(message.data[0])
            if (message.event === 'abort') resolve()
          })
        })
      },
    }
  }
}

export function createThreadRunner(baseUrl: string): ThreadRunner {
  return new ThreadRunner(baseUrl)
}
