import type { ModuleRunner } from '..'
import type { RunnerObject } from '../entities'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'

export function getRunner(this: ModuleRunner) {
  return createHttpRoute(
    {
      name: 'GET /api/runners/:identity',
      parseParameters: createParser({
        identity: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters }): Promise<RunnerObject> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)

      // --- Assert the user is a super administrator.
      if (!user.isSuperAdministrator) throw moduleUser.errors.USER_FORBIDDEN()

      // --- Get runner from the database.
      const { Runner } = this.getRepositories()
      const { identity } = parameters
      const runner = await Runner.findOneBy({ identity })
      if (!runner) throw this.errors.THREAD_RUNNER_NOT_FOUND(identity)
      return runner.serialize()
    },
  )
}
