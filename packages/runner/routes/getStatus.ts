import type { ModuleRunner, ThreadRunnerWorkerPoolStatus } from '../application'
import { createHttpRoute } from '@unserved/server'
import { authorize } from '../utils'
import { getWorkerPoolStatus } from '../worker'

export interface ThreadRunnerStatus {
  isClaimed: boolean
  isRunning: boolean
  isReachable: boolean
  workerPool: ThreadRunnerWorkerPoolStatus[]
}

export function getStatus(this: ModuleRunner) {
  return createHttpRoute(
    { name: 'GET /status' },
    async({ event }): Promise<ThreadRunnerStatus> => {
      authorize.call(this, event)
      return {
        isClaimed: this.runnerIsClaimed,
        isRunning: this.runnerWorkerPool.running > 0,
        isReachable: true,
        workerPool: await getWorkerPoolStatus.call(this),
      }
    },
  )
}
