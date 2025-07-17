import type { ModuleThreadRunner } from '..'
import type { ThreadRunnerObject } from '../entities'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'

export function getThreadRunner(this: ModuleThreadRunner) {
  return createHttpRoute(
    {
      name: 'GET /api/runners/:identity',
      parseParameters: createParser({
        identity: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters }): Promise<ThreadRunnerObject> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)

      // --- Assert the user is a super administrator.
      if (!user.isSuperAdministrator) throw moduleUser.errors.USER_FORBIDDEN()

      // --- Get runner from the database.
      const { ThreadRunner } = this.getRepositories()
      const { identity } = parameters
      const runner = await ThreadRunner.findOneBy({ identity })
      if (!runner) throw this.errors.THREAD_RUNNER_NOT_FOUND(identity)
      return runner.serialize()
    },
  )
}
