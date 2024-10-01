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

      // --- If the request is made by a user other than the super administrator, return an error.
      if (user.username !== username && !user.isSuperAdministrator)
        throw this.errors.USER_NOT_ALLOWED()

      // --- Fetch the user with the given ID.
      const result = await User.findOne({
        where: { username },
        withDeleted: user.isSuperAdministrator,
        relations: {
          profile: query.withProfile,
          sessions: query.withSessions,
        },
      })

      // --- If the `withSession is provided, put the current session at the top of the list.
      if (query.withSessions) {
        result?.sessions?.sort((a, b) => {
          if (a.id === id) return -1
          if (b.id === id) return 1
          return 0
        })
      }

      // --- If the request is made by a super administrator, add additional information.
      if (!result) throw this.errors.USER_NOT_FOUND(username)
      return result.serialize()
    },
  )
}
