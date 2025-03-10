import type { WorkerPool } from '@unshared/process'
import type { ThreadWorker } from './worker'
import { Application, ModuleBase } from '@unserved/server'
import { createWorkerPool } from '@unshared/process'
import Consola from 'consola'
import { randomUUID } from 'node:crypto'
import { availableParallelism } from 'node:os'
import * as ROUTES from './routes'
import { ERRORS } from './utils'

export type { ThreadRunnerStatus } from './routes/getStatus'
export { THREAD_SERVER_MESSAGE_SCHEMA } from './worker'
export { THREAD_CLIENT_MESSAGE_SCHEMA } from './worker'
export type { ThreadRunnerWorkerPoolStatus } from './worker/getWorkerPoolStatus'

export class ModuleRunner extends ModuleBase {
  routes = ROUTES
  errors = ERRORS
  entities = {}

  runnerToken = process.env.NODE_ENV === 'production' ? randomUUID() : '00000000-0000-0000-0000-000000000000'
  runnerIdentity = process.env.NODE_ENV === 'production' ? randomUUID() : 'runner-1'
  runnerIsClaimed = false

  runnerWorkerPool: WorkerPool
  runnerWorkerPoolSize = availableParallelism() - 1
  runnerSessions = new Map<string, ThreadWorker>()

  constructor() {
    super()
    this.runnerWorkerPool = createWorkerPool({
      resourceLimits: { stackSizeMb: 8 },
      argv: ['--untrusted-code-mitigations'],
      size: this.runnerWorkerPoolSize,
    })
  }
}

// --- Expose the application for type inference.
export const application = new Application([ModuleRunner], { logger: Consola })
