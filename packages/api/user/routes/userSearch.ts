import type { ModuleUser, UserObject } from '../index'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string'
import { assertNumberPositiveStrict, assertString, assertStringNotEmpty, assertStringNumber, assertUndefined, createParser } from '@unshared/validation'
import { ILike } from 'typeorm'

export function userSearch(this: ModuleUser) {
  return createHttpRoute(
    {
      name: 'GET /users',
      parseQuery: createParser({
        search: [[assertUndefined], [assertString]],
        page: [[assertUndefined], [assertStringNumber, Number.parseInt, assertNumberPositiveStrict]],
        limit: [[assertUndefined], [assertStringNumber, Number.parseInt, assertNumberPositiveStrict]],
        withProfile: [[assertUndefined], [assertStringNotEmpty, parseBoolean]],
        withProtected: [[assertUndefined], [assertStringNotEmpty, parseBoolean]],
      }),
    },

    async({ event, query }): Promise<UserObject[]> => {
      const { user } = await this.authenticate(event)
      const { search, page = 1, limit = 10, withProfile, withProtected } = query

      // --- Only super administrators can search for users.
      if (!user.isSuperAdministrator) throw this.errors.USER_FORBIDDEN()

      // --- Get the users.
      const { User } = this.getRepositories()
      const users = await User.find({
        where: search
          ? [{ username: ILike(`%${search}%`) }, { profile: { displayName: ILike(`%${search}%`) } }]
          : undefined,
        order: {
          createdAt: 'DESC',
        },
        skip: (page - 1) * limit,
        take: limit,
        relations: {
          profile: withProfile,
        },
      })

      // --- Return the users.
      return users.map(user => user.serialize({
        withProtected,
      }))
    },
  )
}
