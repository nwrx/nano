import type { WorkerPool } from '@unshared/process'
import type { ThreadWorkerSession } from './utils'
import { ModuleBase } from '@unserved/server'
import { createWorkerPool } from '@unshared/process'
import { randomUUID } from 'node:crypto'
import { cpus } from 'node:os'
import * as ROUTES from './routes'

export class ModuleRunner extends ModuleBase {
  routes = ROUTES

  runnerSecret = randomUUID()
  runnerWorkerPool: WorkerPool
  runnerWorkerPoolSize = cpus().length * 2 - 1
  runnerSessions = new Map<string, ThreadWorkerSession>()

  constructor() {
    super()
    this.runnerWorkerPool = createWorkerPool({
      resourceLimits: { stackSizeMb: 8 },
      argv: ['--untrusted-code-mitigations'],
      size: this.runnerWorkerPoolSize,
      eager: true,
    })
  }
}
