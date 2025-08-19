import type { MessagePort } from 'node:worker_threads'
import { Application, ModuleBase } from '@unserved/server'
import { createWorkerPool } from '@unshared/process'
import Consola from 'consola'
import { randomBytes } from 'node:crypto'
import { availableParallelism } from 'node:os'
import { ENV_CONFIG_SCHEMA } from './environment'
import * as ROUTES from './routes'
import { ERRORS } from './utils'

export interface ModuleRunnerOptions {
  /*
   * The name of the runner. This is used to identify the runner in logs and metrics.
   * It should be a unique identifier for the runner.
   */
  name?: string

  /*
   * The token of the runner. This is used to authenticate the runner with the API server.
   * It should be a UUID string.
   */
  token?: string
}

export class ModuleRunner extends ModuleBase {
  routes = ROUTES
  errors = ERRORS
  entities = {}

  constructor(options: ModuleRunnerOptions = {}) {
    super()
    if (options.name) this.name = options.name
    if (options.token) this.token = options.token
  }

  name = randomBytes(8).toString('hex')
  token = randomBytes(16).toString('hex')
  isClaimed = false

  threads = new Map<string, Promise<MessagePort>>()
  workerPoolSize = Math.max(availableParallelism() - 1, 1)
  workerPools = createWorkerPool({
    resourceLimits: { stackSizeMb: 8 },
    argv: ['--untrusted-code-mitigations'],
    size: this.workerPoolSize,
  })
}

// --- Expose the application for type inference.
const config = ENV_CONFIG_SCHEMA(process.env)
export const application = new Application(
  [
    new ModuleRunner({
      name: config.RUNNER_NAME,
      token: config.RUNNER_TOKEN,
    }),
  ],
  {
    logger: Consola,
  },
)
