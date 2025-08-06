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

      // --- Check if the runner is not claimed.
      if (!this.runnerIsClaimed) throw this.errors.RUNNER_NOT_CLAIMED()

      // --- Release the runner.
      this.runnerIsClaimed = false
      this.runnerMasterAddress = '127.0.0.1'

      // --- Stop all worker threads.
      await this.workerPools.destroy()
    },
  )
}
