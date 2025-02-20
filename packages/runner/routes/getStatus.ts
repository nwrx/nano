import type { ModuleRunner, ThreadRunnerWorkerPoolStatus } from '../application'
import { createHttpRoute } from '@unserved/server'
import { authorize } from '../utils'
import { getWorkerPoolStatus } from '../worker'

export interface ThreadRunnerStatus {
  workerPool: ThreadRunnerWorkerPoolStatus[]
}

export function getStatus(this: ModuleRunner) {
  return createHttpRoute(
    { name: 'GET /status' },
    async({ event }): Promise<ThreadRunnerStatus> => {
      authorize.call(this, event)
      return {
        workerPool: await getWorkerPoolStatus.call(this),
      }
    },
  )
}
