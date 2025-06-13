import type { ModuleThreadRunner } from '..'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'

export function threadRunnerDisable(this: ModuleThreadRunner) {
  return createHttpRoute(
    {
      name: 'PUT /api/runners/:identity/disable',
      parseParameters: createParser({ identity: assertStringNotEmpty }),
    },
    async({ event, parameters }) => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)
      const { identity } = parameters

      // --- Assert the user is a super administrator.
      if (!user.isSuperAdministrator) throw moduleUser.errors.USER_FORBIDDEN()

      // --- Find and disable the thread runner from the database.
      const { ThreadRunner } = this.getRepositories()
      const runner = await ThreadRunner.findOneBy({ identity })

      // --- If the runner is not found or already disabled, throw an error.
      if (!runner) throw this.errors.THREAD_RUNNER_NOT_FOUND(identity)
      if (runner.disabledAt) throw this.errors.THREAD_RUNNER_ALREADY_DISABLED(identity)

      runner.disabledAt = new Date()
      await ThreadRunner.save(runner)
    },
  )
}
