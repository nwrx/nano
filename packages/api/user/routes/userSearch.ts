import type { ModuleUser } from '../index'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string'
import { assertNumberPositiveStrict, assertString, assertStringNotEmpty, assertStringNumber, assertUndefined, createSchema } from '@unshared/validation'
import { ILike } from 'typeorm'

export function userSearch(this: ModuleUser) {
  return createHttpRoute(
    {
      name: 'GET /api/users',
      parseQuery: createSchema({
        search: [[assertUndefined], [assertString]],
        page: [[assertUndefined], [assertStringNumber, Number.parseInt, assertNumberPositiveStrict]],
        limit: [[assertUndefined], [assertStringNumber, Number.parseInt, assertNumberPositiveStrict]],
        withProfile: [[assertUndefined], [assertStringNotEmpty, parseBoolean]],
        withSessions: [[assertUndefined], [assertStringNotEmpty, parseBoolean]],
      }),
    },

    async({ event, query }) => {
      const { user } = await this.authenticate(event)
      const { search, page = 1, limit = 10, withProfile = false, withSessions = false } = query

      // --- Check if the user is allowed to make the request.
      const isPrivilegedQuery = withSessions
      const isPrivilegedUser = user.isSuperAdministrator
      if (isPrivilegedQuery && !isPrivilegedUser) throw this.errors.USER_NOT_ALLOWED()

      // --- Get the users.
      const { User } = this.getRepositories()
      const users = await User.find({
        where: search
          ? [
            { username: ILike(`%${search}%`) },
            { profile: { displayName: ILike(`%${search}%`) } },
          ]
          : undefined,
        relations: {
          profile: withProfile,
          sessions: withSessions,
        },
        order: {
          createdAt: 'DESC',
        },
        skip: (page - 1) * limit,
        take: limit,
      })

      // --- Return the users.
      return users.map(user => user.serialize({
        withProtected: isPrivilegedQuery,
        withSessions: isPrivilegedQuery,
      }))
    },
  )
}
