import type { ModuleRunner, ThreadRunnerWorkerPoolStatus } from '../application'
import { createHttpRoute } from '@unserved/server'
import os from 'node:os'
import { authorize } from '../utils'
import { getWorkerPoolStatus } from '../worker'

export interface ThreadRunnerStatus {
  isClaimed: boolean
  isRunning: boolean
  isReachable: boolean
  workerPool: ThreadRunnerWorkerPoolStatus[]
  freemem: number
  totalmem: number
  availmem: number
  availableParallelismv: number
  loadavg: number[]
  cpus: os.CpuInfo[]
  platform: string
  release: string
  type: string
  version: string
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
        freemem: os.freemem(),
        totalmem: os.totalmem(),
        availmem: os.totalmem() - os.freemem(),
        availableParallelismv: os.availableParallelism(),
        loadavg: os.loadavg(),
        cpus: os.cpus(),
        platform: os.platform(),
        release: os.release(),
        type: os.type(),
        version: os.version(),
        workerPool: await getWorkerPoolStatus.call(this),
      }
    },
  )
}
