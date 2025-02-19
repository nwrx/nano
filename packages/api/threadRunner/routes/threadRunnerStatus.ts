import type { ModuleThreadRunner } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertStringUuid, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'

export function getThreadRunnerStatus(this: ModuleThreadRunner) {
  return createHttpRoute(
    {
      name: 'GET /api/runners/:runner',
      parseParameters: createSchema({
        runner: assertStringUuid,
      }),
    },
    async({ event, parameters }) => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)

      // --- Assert the user is a super administrator.
      if (!user?.isSuperAdministrator) throw moduleUser.errors.USER_NOT_ALLOWED()

      // --- Retrieve the thread runner by id.
      const runner = this.threadRunners.get(parameters.runner)
      if (!runner) throw this.errors.THREAD_RUNNER_NOT_FOUND(parameters.runner)

      // --- Return the thread runner status.
      return await runner.getStatus()
    },
  )
}
