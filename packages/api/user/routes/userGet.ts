import type { ModuleUser } from '../index'
import { createRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string'
import { assertStringNotEmpty, assertUndefined, createSchema } from '@unshared/validation'

export function userGet(this: ModuleUser) {
  return createRoute(
    {
      name: 'GET /api/users/:username',
      parameters: createSchema({
        username: assertStringNotEmpty,
      }),
      query: createSchema({
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
      const isPrivilegedQuery = withSessions
      const isPrivilegedUser = user.username === username || user.isSuperAdministrator
      if (isPrivilegedQuery && !isPrivilegedUser) throw this.errors.USER_NOT_ALLOWED()

      // --- Fetch the user with the given ID.
      const result = await User.findOne({
        where: { username },
        withDeleted: user.isSuperAdministrator,
        relations: {
          profile: withProfile,
          sessions: withSessions,
        },
      })

      // --- If the user is not found, return an error.
      if (!result) throw this.errors.USER_NOT_FOUND(username)

      // --- If the `withSession is provided, put the current session at the top of the list.
      if (withSessions) {
        result?.sessions?.sort((a, b) => {
          if (a.id === id) return -1
          if (b.id === id) return 1
          return 0
        })
      }

      // --- If the request is made by a super administrator, add additional information.
      return result.serialize({
        withProtected: isPrivilegedUser,
        withSessions: isPrivilegedQuery,
      })
    },
  )
}
