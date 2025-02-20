import type { ThreadRunnerStatus as ThreadRunnerRemoteStatus } from '@nwrx/nano-runner'
import type { ModuleThreadRunner, ThreadRunnerObject } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertStringUuid, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'

export interface ThreadRunnerStatus extends ThreadRunnerObject, ThreadRunnerRemoteStatus {}

export function getThreadRunnerStatus(this: ModuleThreadRunner) {
  return createHttpRoute(
    {
      name: 'GET /api/runners/:runner',
      parseParameters: createSchema({
        runner: assertStringUuid,
      }),
    },
    async({ event, parameters }): Promise<ThreadRunnerStatus> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)

      // --- Assert the user is a super administrator.
      if (!user?.isSuperAdministrator) throw moduleUser.errors.USER_NOT_ALLOWED()

      // --- Retrieve the thread runner from the database.
      const { ThreadRunner } = this.getRepositories()
      const threadRunner = await ThreadRunner.findOneBy({ id: parameters.runner })
      if (!threadRunner) throw this.errors.THREAD_RUNNER_NOT_FOUND(parameters.runner)
      const threadRunnerStatus: ThreadRunnerStatus = {
        ...threadRunner.serialize(),
        isRunning: false,
        isClaimed: false,
        isReachable: false,
        workerPool: [],
      }

      // --- Retrieve the thread runner client and get its status.
      const runner = this.threadRunners.get(parameters.runner)
      if (!runner) return threadRunnerStatus
      return await runner.getStatus()
        .then(status => ({ ...threadRunnerStatus, ...status }))
        .catch(() => ({ ...threadRunnerStatus }))
    },
  )
}
