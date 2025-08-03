import type { RunnerStatus } from '@nwrx/nano-runner'
import type { ModuleRunner } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'

export function runnerStatus(this: ModuleRunner) {
  return createHttpRoute(
    {
      name: 'GET /api/runners/:identity/status',
      parseParameters: createParser({
        identity: assertStringNotEmpty,
      }),
    },
    async({ event, parameters }): Promise<RunnerStatus> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)
      const { identity } = parameters

      // --- Assert the user is a super administrator.
      if (!user?.isSuperAdministrator) throw moduleUser.errors.USER_FORBIDDEN()

      // --- Retrieve the thread runner from the database.
      const { Runner } = this.getRepositories()
      const runner = await Runner.findOneBy({ identity })
      if (!runner) throw this.errors.THREAD_RUNNER_NOT_FOUND(identity)

      // --- Retrieve the thread runner client and get its status.
      const client = this.runnerClients.get(runner.id)
      if (!client) throw this.errors.THREAD_RUNNER_NOT_FOUND(identity)
      return await client.getStatus().catch((error: Error) => {
        throw this.errors.THREAD_RUNNER_NOT_REACHABLE(identity, error.message)
      })
    },
  )
}
