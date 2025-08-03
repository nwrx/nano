import type { ModuleRunner } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'

export function releaseRunner(this: ModuleRunner) {
  return createHttpRoute(
    {
      name: 'DELETE /api/runners/:identity',
      parseParameters: createParser({
        identity: assertStringNotEmpty,
      }),
    },
    async({ event, parameters }) => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)
      const { identity } = parameters

      // --- Assert the user is a super administrator.
      if (!user?.isSuperAdministrator) throw moduleUser.errors.USER_FORBIDDEN()

      // --- Find and soft remove the thread runner from the database.
      const { Runner } = this.getRepositories()
      const runner = await Runner.findOneBy({ identity })
      if (!runner) throw this.errors.THREAD_RUNNER_NOT_FOUND(identity)
      await Runner.softRemove(runner)

      // --- If the runner client exists, release it.
      const client = this.runnerClients.get(identity)
      if (client) await client.release()
      this.runnerClients.delete(identity)
    },
  )
}
