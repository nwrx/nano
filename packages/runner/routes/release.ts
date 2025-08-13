import type { ModuleRunner } from '../application'
import { createHttpRoute } from '@unserved/server'
import { authorize } from '../utils'

export function release(this: ModuleRunner) {
  return createHttpRoute(
    {
      name: 'POST /release',
    },
    async({ event }) => {
      authorize.call(this, event)
      if (!this.isClaimed) throw this.errors.RUNNER_NOT_CLAIMED()
      this.isClaimed = false
      await this.workerPools.destroy()
    },
  )
}
