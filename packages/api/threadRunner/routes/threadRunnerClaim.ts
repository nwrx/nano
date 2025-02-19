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
      parseBody: createSchema({ address: assertStringNotEmpty }),
    },
    async({ event, body }) => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)
      const { address } = body
      await registerThreadRunner.call(this, { address, user })
      setResponseStatus(event, 201)
    },
  )
}
