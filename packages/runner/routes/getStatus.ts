import type { ModuleRunner } from '../module'
import { createHttpRoute } from '@unserved/server'
import { authorize } from '../utils'
import { getWorkerPoolStatus } from '../worker'

export function getStatus(this: ModuleRunner) {
  return createHttpRoute(
    { name: 'GET /status' },
    async({ event }) => {
      authorize.call(this, event)
      return {
        workerPool: await getWorkerPoolStatus.call(this),
      }
    },
  )
}
