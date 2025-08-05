import type { ModuleRunner } from '../application'
import type { SystemStatus } from '../utils'
import type { RunnerWorkerPoolStatus } from '../worker'
import { createHttpRoute } from '@unserved/server'
import packageJson from '../../../package.json'
import { authorize, getSystemStatus } from '../utils'
import { getWorkerPoolStatus } from '../worker'

export interface RunnerStatus {

  /** Indicates if the system is operational. */
  ok: boolean

  /** Indicates if the runner is claimed. */
  isClaimed: boolean

  /** The version of the application. */
  version: string

  /** The uptime of the application in seconds. */
  uptime: number

  /** The system status. */
  system: SystemStatus

  /** The worker pool status. */
  workerPool: RunnerWorkerPoolStatus[]
}

export function getStatus(this: ModuleRunner) {
  return createHttpRoute(
    { name: 'GET /status' },
    async({ event }): Promise<RunnerStatus> => {
      authorize.call(this, event)
      return {
        ok: true,
        isClaimed: this.runnerIsClaimed,
        version: packageJson.version,
        uptime: Math.floor(process.uptime()),
        system: getSystemStatus(),
        workerPool: await getWorkerPoolStatus.call(this),
      }
    },
  )
}
