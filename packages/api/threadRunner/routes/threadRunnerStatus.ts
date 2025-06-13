import type { ThreadRunnerStatus } from '@nwrx/nano-runner'
import type { ModuleThreadRunner } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'

export function threadRunnerStatus(this: ModuleThreadRunner) {
  return createHttpRoute(
    {
      name: 'GET /api/runners/:identity',
      parseParameters: createParser({
        identity: assertStringNotEmpty,
      }),
    },
    async({ event, parameters }): Promise<ThreadRunnerStatus> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)
      const { identity } = parameters

      // --- Assert the user is a super administrator.
      if (!user?.isSuperAdministrator) throw moduleUser.errors.USER_FORBIDDEN()

      // --- Retrieve the thread runner from the database.
      const { ThreadRunner } = this.getRepositories()
      const threadRunner = await ThreadRunner.findOneBy({ identity })
      if (!threadRunner) throw this.errors.THREAD_RUNNER_NOT_FOUND(identity)

      // --- Retrieve the thread runner client and get its status.
      const runner = this.threadRunners.get(threadRunner.id)
      if (!runner) throw this.errors.THREAD_RUNNER_NOT_FOUND(identity)
      return await runner.getStatus().catch((error: Error) => {
        throw this.errors.THREAD_RUNNER_NOT_REACHABLE(identity, error.message)
      })
    },
  )
}
