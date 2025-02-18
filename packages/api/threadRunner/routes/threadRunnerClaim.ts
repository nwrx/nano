import type { ModuleThreadRunner } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, createSchema } from '@unshared/validation'
import { setResponseStatus } from 'h3'
import { randomUUID } from 'node:crypto'
import { ModuleUser } from '../../user'
import { createThreadRunner } from '../utils/createThreadRunner'

export function claimThreadRunner(this: ModuleThreadRunner) {
  return createHttpRoute(
    {
      name: 'POST /api/threads/runners',
      parseBody: createSchema({ baseUrl: assertStringNotEmpty }),
    },
    async({ event, body }) => {
      const { baseUrl } = body
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)

      // --- Assert the user is a super administrator.
      if (!user?.isSuperAdministrator) throw moduleUser.errors.USER_NOT_ALLOWED()

      // --- Check if a thread runner with the same base URL already exists
      const { ThreadRunner } = this.getRepositories()
      const exists = await ThreadRunner.countBy({ baseUrl })
      if (exists > 0) throw this.errors.THREAD_RUNNER_ALREADY_REGISTERED(baseUrl)

      // --- Register, claim, and store the thread runner.
      const id = randomUUID()
      const client = createThreadRunner.call(this, baseUrl)
      const token = await client.claim()
      await client.ping()
      this.threadRunners.set(id, client)

      // --- Store the thread runner in the database.
      const runner = ThreadRunner.create({ id, baseUrl, token, lastSeenAt: new Date() })
      await ThreadRunner.save(runner)
      setResponseStatus(event, 204)
    },
  )
}
