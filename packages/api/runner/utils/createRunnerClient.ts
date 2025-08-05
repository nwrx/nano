import type { ModuleRunner as ModuleRunnerRemote, RunnerStatus } from '@nwrx/nano-runner'
import type { ServerErrorName } from '@unserved/server'
import type { ObjectLike } from '@unshared/types'
import type { Runner } from '../entities'
import type { RunnerRegisterResult, RunnerThreadChannel } from './types'
import { createClient } from '@unserved/client'
import { createError, createEventBus } from '@unserved/server'
import { toConstantCase } from '@unshared/string'
import { createParser } from '@unshared/validation'
import { assertRunner } from './assertRunner'

export class RunnerClient {
  constructor(public readonly runner: Runner) {
    const { address, token } = runner
    this.client.options.baseUrl = address
    this.client.options.headers = { Authorization: `Bearer ${token}` }
  }

  /***************************************************************************/
  /* Client                                                                  */
  /***************************************************************************/

  client = createClient<ModuleRunnerRemote>({
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

  async claim(): Promise<RunnerRegisterResult> {
    const result = await this.client.request('POST /claim')
    this.client.options.headers = { Authorization: `Bearer ${result.token}` }
    await this.client.request('GET /ping')
    return result
  }

  async release() {
    await this.client.request('POST /release')
    this.client.options.headers = {}
  }

  createThreadSession(): RunnerThreadChannel {
    console.log({
      token: this.runner.token,
      address: this.runner.address,
    })
    return this.client.connect('WS /threads', {
      query: { token: this.runner.token },
      autoReconnect: true,
      reconnectDelay: 300,
      reconnectLimit: 3,
    }) as RunnerThreadChannel
  }

  /***************************************************************************/
  /* Status                                                                  */
  /***************************************************************************/

  private statusInterval: NodeJS.Timeout | undefined
  public async getStatus(): Promise<RunnerStatus> {
    return await this.client.request('GET /status')
  }

  public status = createEventBus<RunnerStatus>({
    onMount: () => {
      this.statusInterval = setInterval(() => {
        this.getStatus()
          .then((data: RunnerStatus) => this.status.sendMessage(data))
          .catch((error: Error) => this.status.sendError(error))
      }, 1000)
    },
    onUnmount: () => {
      if (!this.statusInterval) return
      clearInterval(this.statusInterval)
      this.statusInterval = undefined
    },
  })

  /***************************************************************************/
  /* Cleanup                                                                */
  /***************************************************************************/

  public async dispose() {
    clearInterval(this.statusInterval)
    await this.release()
  }
}

/** The schema for the {@linkcode createRunnerClient} function options. */
export const CREATE_RUNNER_CLIENT_OPTIONS_SCHEMA = createParser({
  runner: assertRunner,
})

/** The options for the {@linkcode createRunnerClient} function. */
export type CreateRunnerClientOptions = ReturnType<typeof CREATE_RUNNER_CLIENT_OPTIONS_SCHEMA>

/**
 * Create a new {@linkcode RunnerClient} instance with the specified options.
 * This client can be used to interact with a remote thread runner.
 *
 * @param options The options for creating the runner client.
 * @returns A new instance of {@linkcode RunnerClient}.
 * @example createRunnerClient({ address: 'http://localhost:3000', token: 'your-token' })
 */
export function createRunnerClient(options: CreateRunnerClientOptions) {
  const { runner } = CREATE_RUNNER_CLIENT_OPTIONS_SCHEMA(options)
  return new RunnerClient(runner)
}
