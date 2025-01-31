import type { WorkerPool } from '@unshared/process'
import type { ThreadWorkerSession } from './worker'
import { ModuleBase } from '@unserved/server'
import { createWorkerPool } from '@unshared/process'
import { randomUUID } from 'node:crypto'
import { cpus } from 'node:os'
import * as ROUTES from './routes'
import { ERRORS } from './utils'

export class ModuleRunner extends ModuleBase {
  routes = ROUTES
  errors = ERRORS
  entities = {}

  runnerToken = randomUUID()
  runnerIsClaimed = false
  runnerTrustProxy = false
  runnerMasterAddress = '127.0.0.1'

  runnerWorkerPool: WorkerPool
  runnerWorkerPoolSize = cpus().length - 1
  runnerSessions = new Map<string, ThreadWorkerSession>()

  constructor() {
    super()
    this.runnerWorkerPool = createWorkerPool({
      resourceLimits: { stackSizeMb: 8 },
      argv: ['--untrusted-code-mitigations'],
      size: this.runnerWorkerPoolSize,
    })
  }
}
