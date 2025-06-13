/* eslint-disable unicorn/no-null */
import type { ModuleThreadRunner } from '..'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'

export function threadRunnerEnable(this: ModuleThreadRunner) {
  return createHttpRoute(
    {
      name: 'PUT /api/runners/:identity/enable',
      parseParameters: createParser({ identity: assertStringNotEmpty }),
    },
    async({ event, parameters }) => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)
      const { identity } = parameters

      // --- Assert the user is a super administrator.
      if (!user.isSuperAdministrator) throw moduleUser.errors.USER_FORBIDDEN()

      // --- Find and enable the thread runner from the database.
      const { ThreadRunner } = this.getRepositories()
      const runner = await ThreadRunner.findOneBy({ identity })

      // --- If the runner is not found or already enabled, throw an error.
      if (!runner) throw this.errors.THREAD_RUNNER_NOT_FOUND(identity)
      if (!runner.disabledAt) throw this.errors.THREAD_RUNNER_ALREADY_ENABLED(identity)

      runner.disabledAt = null
      await ThreadRunner.save(runner)
    },
  )
}
