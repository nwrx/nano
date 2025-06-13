import type { ModuleUser } from '../index'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string'
import { assert, createParser } from '@unshared/validation'
import { getUser } from '../utils'

export function userGet(this: ModuleUser) {
  return createHttpRoute(
    {
      name: 'GET /api/users/:username',
      parseParameters: createParser({
        username: assert.stringNotEmpty,
      }),
      parseQuery: createParser({
        withDeleted: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withDisabled: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withProfile: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
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
        withProfile: query.withProfile,
      })

      // --- Serialize the user and return it.
      const withProtected = user.username === found.username || Boolean(user.isSuperAdministrator)
      return found.serialize({ withProtected })
    },
  )
}
