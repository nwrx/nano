import type { ModuleUser } from '../index'
import { createRoute } from '@unserved/server'
import { assertStringNotEmpty, createSchema } from '@unshared/validation'

export function userDelete(this: ModuleUser) {
  return createRoute(
    {
      name: 'DELETE /api/users/:username',
      parameters: createSchema({
        username: assertStringNotEmpty,
      }),
    },
    async({ event, parameters }) => {
      const { username } = parameters
      const { user } = await this.authenticate(event)

      // --- Check if the user has the right permissions.
      if (user.username !== username && !user.isSuperAdministrator)
        throw this.errors.USER_NOT_ALLOWED()

      // --- Find the user by the username and soft-remove it.
      const { User } = this.getRepositories()
      const userToDelete = await User.findOne({ where: { username } })
      if (!userToDelete) return this.errors.USER_NOT_FOUND(username)
      await User.softRemove(userToDelete)
    },
  )
}
