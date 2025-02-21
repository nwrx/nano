import type { ModuleThreadRunner } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'

export function releaseThreadRunner(this: ModuleThreadRunner) {
  return createHttpRoute(
    {
      name: 'DELETE /api/runners/:identity',
      parseParameters: createSchema({
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
      const { ThreadRunner } = this.getRepositories()
      const runner = await ThreadRunner.findOneBy({ identity })
      if (!runner) throw this.errors.THREAD_RUNNER_NOT_FOUND(identity)
      await ThreadRunner.softRemove(runner)

      // --- If the runner client exists, release it.
      const client = this.threadRunners.get(identity)
      if (client) await client.release()
      this.threadRunners.delete(identity)
    },
  )
}
