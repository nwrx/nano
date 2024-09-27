import type { ModuleUser } from '../index'
import { createRoute } from '@unserved/server'
import { assertStringNotEmpty, createSchema } from '@unshared/validation'

export function userGet(this: ModuleUser) {
  return createRoute(
    {
      name: 'GET /api/users/:username',
      parameters: createSchema({
        username: assertStringNotEmpty,
      }),
    },
    async({ event, parameters }) => {
      const { user } = await this.authenticate(event)
      const { User } = this.getRepositories()
      const { username } = parameters

      // --- If the request is made by a user other than the super administrator, return an error.
      if (user.username !== username && !user.isSuperAdministrator)
        throw this.errors.USER_NOT_ALLOWED()

      // --- Fetch the user with the given ID.
      const result = await User.findOne({
        where: { username },
        withDeleted: user.isSuperAdministrator,
      })

      // --- If the request is made by a super administrator, add additional information.
      if (!result) throw this.errors.USER_NOT_FOUND(username)
      return result.serialize()
    },
  )
}
