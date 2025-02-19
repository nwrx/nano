import type { ModuleThreadRunner } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, createSchema } from '@unshared/validation'
import { setResponseStatus } from 'h3'
import { ModuleUser } from '../../user'
import { registerThreadRunner } from '../utils/registerThreadRunner'

export function claimThreadRunner(this: ModuleThreadRunner) {
  return createHttpRoute(
    {
      name: 'POST /api/runners',
      parseBody: createSchema({ baseUrl: assertStringNotEmpty }),
    },
    async({ event, body }) => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)
      await registerThreadRunner.call(this, { baseUrl: body.baseUrl, user })
      setResponseStatus(event, 204)
    },
  )
}
