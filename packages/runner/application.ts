import type { MessagePort } from 'node:worker_threads'
import { Application, ModuleBase } from '@unserved/server'
import { createWorkerPool } from '@unshared/process'
import Consola from 'consola'
import { randomUUID } from 'node:crypto'
import { availableParallelism } from 'node:os'
import * as ROUTES from './routes'
import { ERRORS } from './utils'

export class ModuleRunner extends ModuleBase {
  routes = ROUTES
  errors = ERRORS
  entities = {}

  runnerToken = process.env.NODE_ENV === 'production' ? randomUUID() : '00000000-0000-0000-0000-000000000000'
  runnerIdentity = process.env.NODE_ENV === 'production' ? randomUUID() : 'runner-1'
  runnerIsClaimed = false

  runnerWorkerPoolSize = Math.max(availableParallelism() - 1, 1)
  runnerWorkerPorts = new Map<string, Promise<MessagePort>>()
  runnerWorkerPool = createWorkerPool({
    resourceLimits: { stackSizeMb: 8 },
    argv: ['--untrusted-code-mitigations'],
    size: this.runnerWorkerPoolSize,
  })
}

// --- Expose the application for type inference.
export const application = new Application([ModuleRunner], { logger: Consola })
