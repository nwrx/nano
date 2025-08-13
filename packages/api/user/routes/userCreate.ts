import type { ModuleUser } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertStringEmail, assertStringNotEmpty, createParser } from '@unshared/validation'
import { setResponseStatus } from 'h3'
import { registerUser } from '../utils'

export function userCreate(this: ModuleUser) {
  return createHttpRoute(
    {
      name: 'POST /users',
      parseBody: createParser({
        email: [assertStringEmail],
        username: [assertStringNotEmpty],
      }),
    },
    async({ event, body }): Promise<void> => {
      const { user } = await this.authenticate(event)
      if (!user.isSuperAdministrator) throw this.errors.USER_FORBIDDEN()
      await registerUser.call(this, body)
      setResponseStatus(event, 201)
    },
  )
}
