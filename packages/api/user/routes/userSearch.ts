import type { ModuleUser, UserObject } from '../index'
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
      }),
    },

    async({ query }): Promise<UserObject[]> => {
      const { search, page = 1, limit = 10, withProfile } = query

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
      return users.map(user => user.serialize())
    },
  )
}
