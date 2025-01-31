import type { ModuleThread } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, createSchema } from '@unshared/validation'
import { registerThreadRunner } from '../utils/registerThreadRunner'

export function claimThreadRunner(this: ModuleThread) {
  return createHttpRoute(
    {
      name: 'POST /api/runners',
      parseBody: createSchema({ baseUrl: assertStringNotEmpty }),
    },
    async({ body }) => {
      const { baseUrl } = body
      const runner = await registerThreadRunner.call(this, baseUrl)
      this.threadRunners.set(baseUrl, runner)
    },
  )
}
