import type { ModuleRunner } from '..'
import type { RunnerObject } from '../entities'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'

export function updateRunner(this: ModuleRunner) {
  return createHttpRoute(
    {
      name: 'PUT /api/runners/:identity',
      parseParameters: createParser({
        identity: assert.stringNotEmpty,
      }),
      parseBody: createParser({
        address: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters, body }): Promise<RunnerObject> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)

      // --- Assert the user is a super administrator.
      if (!user.isSuperAdministrator) throw moduleUser.errors.USER_FORBIDDEN()

      // --- Get runner from the database.
      const { Runner } = this.getRepositories()
      const { identity } = parameters
      const runner = await Runner.findOneBy({ identity })
      if (!runner) throw this.errors.THREAD_RUNNER_NOT_FOUND(identity)

      // --- Update the client.
      const runnerClient = this.runnerClients.get(runner.id)
      if (!runnerClient) throw this.errors.THREAD_RUNNER_NOT_FOUND(identity)
      runnerClient.address = body.address

      // --- Update the runner address.
      runner.address = body.address
      await Runner.save(runner)
      return runner.serialize()
    },
  )
}
