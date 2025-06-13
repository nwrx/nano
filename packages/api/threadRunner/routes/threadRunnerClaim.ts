import type { ModuleThreadRunner } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, createParser } from '@unshared/validation'
import { setResponseStatus } from 'h3'
import { ModuleUser } from '../../user'
import { registerThreadRunner } from '../utils/registerThreadRunner'

export function threadRunnerClaim(this: ModuleThreadRunner) {
  return createHttpRoute(
    {
      name: 'POST /api/runners',
      parseBody: createParser({ address: assertStringNotEmpty }),
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
