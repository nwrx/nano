import type { ModuleUser } from '../index'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string'
import { assertStringNotEmpty, assertUndefined, createSchema } from '@unshared/validation'

export function userGet(this: ModuleUser) {
  return createHttpRoute(
    {
      name: 'GET /api/users/:username',
      parseParameters: createSchema({
        username: assertStringNotEmpty,
      }),
      parseQuery: createSchema({
        withProfile: [[assertUndefined], [assertStringNotEmpty, parseBoolean]],
        withSessions: [[assertUndefined], [assertStringNotEmpty, parseBoolean]],
      }),
    },
    async({ event, parameters, query }) => {
      const { id, user } = await this.authenticate(event)
      const { User } = this.getRepositories()
      const { username } = parameters
      const { withProfile = false, withSessions = false } = query

      // --- Check if the user is allowed to make the request.
      const withProtected = user.username === username || Boolean(user.isSuperAdministrator)
      if (withSessions && !withProtected) throw this.errors.USER_FORBIDDEN()

      // --- Fetch the user with the given ID.
      const found = await User.findOne({
        where: { username },
        withDeleted: Boolean(user.isSuperAdministrator),
        relations: {
          profile: withProfile,
          sessions: withSessions,
        },
      })

      // --- If the `withSession` flag is provided, put the current session at the top of the list.
      if (!found) throw this.errors.USER_NOT_FOUND(username)
      if (withSessions) {
        found?.sessions?.sort((a, b) => {
          if (a.id === id) return -1
          if (b.id === id) return 1
          return 0
        })
      }

      // --- If the request is made by a super administrator, add additional information.
      return found.serialize({
        withProtected,
        withSessions,
      })
    },
  )
}
