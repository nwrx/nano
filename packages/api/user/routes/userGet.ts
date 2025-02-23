import type { ModuleUser } from '../index'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string'
import { assert, createSchema } from '@unshared/validation'
import { getUser } from '../utils'

export function userGet(this: ModuleUser) {
  return createHttpRoute(
    {
      name: 'GET /api/users/:username',
      parseParameters: createSchema({
        username: assert.stringNotEmpty,
      }),
      parseQuery: createSchema({
        withDeleted: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withDisabled: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
      }),
    },
    async({ event, parameters, query }) => {
      const { user } = await this.authenticate(event)

      // --- Fetch and return the user with the given username.
      const found = await getUser.call(this, {
        user,
        username: parameters.username,
        withDeleted: query.withDeleted,
        withDisabled: query.withDisabled,
      })

      // --- Serialize the user and return it.
      const withProtected = user.username === found.username || Boolean(user.isSuperAdministrator)
      return found.serialize({ withProtected })
    },
  )
}
