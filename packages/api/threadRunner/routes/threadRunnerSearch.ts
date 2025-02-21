import type { ThreadRunnerStatus } from '@nwrx/nano-runner'
import type { ModuleThreadRunner } from '..'
import type { ThreadRunnerObject } from '../entities'
import { createHttpRoute } from '@unserved/server'
import { ModuleUser } from '../../user'

export function searchThreadRunner(this: ModuleThreadRunner) {
  return createHttpRoute(
    {
      name: 'GET /api/runners',
    },
    async({ event }): Promise<Array<ThreadRunnerObject & ThreadRunnerStatus>> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)

      // --- Assert the user is a super administrator.
      if (!user?.isSuperAdministrator)
        throw moduleUser.errors.USER_NOT_ALLOWED()

      // --- Get runners from the database.
      const { ThreadRunner } = this.getRepositories()
      const runners = await ThreadRunner.find()

      // --- Return the thread runner status.
      const promises = runners.map(async(runner) => {
        const threadRunnerStatus: ThreadRunnerObject & ThreadRunnerStatus = {
          ...runner.serialize(),
          isRunning: false,
          isClaimed: false,
          isReachable: false,
          workerPool: [],
        }
        const client = this.threadRunners.get(runner.id)
        if (!client) return threadRunnerStatus
        return client.getStatus()
          .then(status => ({ ...threadRunnerStatus, ...status }))
          .catch(() => ({ ...threadRunnerStatus }))
      })

      // --- Return the thread runner status.
      return Promise.all(promises)
    },
  )
}
