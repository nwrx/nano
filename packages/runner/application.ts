import type { WorkerPool } from '@unshared/process'
import type { ThreadWorker } from './worker'
import { Application, ModuleBase } from '@unserved/server'
import { createWorkerPool } from '@unshared/process'
import Consola from 'consola'
import { randomUUID } from 'node:crypto'
import { cpus } from 'node:os'
import * as ROUTES from './routes'
import { ERRORS } from './utils'

export type { ThreadRunnerStatus } from './routes/getStatus'
export type { ThreadRunnerWorkerPoolStatus } from './worker/getWorkerPoolStatus'

export class ModuleRunner extends ModuleBase {
  routes = ROUTES
  errors = ERRORS
  entities = {}

  runnerToken = randomUUID()
  runnerIdentity = randomUUID()
  runnerIsClaimed = false
  runnerTrustProxy = false
  runnerMasterAddress = '127.0.0.1'

  runnerWorkerPool: WorkerPool
  runnerWorkerPoolSize = cpus().length - 1
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
