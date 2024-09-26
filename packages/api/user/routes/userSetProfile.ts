import type { ModuleUser } from '../index'
import { createRoute } from '@unserved/server'
import { assertStringNotEmpty, assertStringUuid, createSchema } from '@unshared/validation'

export function userSetProfile(this: ModuleUser) {
  return createRoute(
    {
      name: 'PUT /api/users/:username/profile',
      parameters: createSchema({
        username: assertStringUuid,
      }),
      body: createSchema({
        displayName: assertStringNotEmpty,
      }),
    },
    async({ event, parameters, body }): Promise<void> => {
      const { username } = parameters
      const { displayName } = body
      const { user } = await this.authenticate(event)

      // --- Check if the user is allowed to update the profile.
      if (user.username !== username && !user.isSuperAdministrator)
        throw this.errors.USER_NOT_ALLOWED()

      // --- Find the user by the ID.
      const userToUpdate = await this.resolveUser(username)
      userToUpdate.displayName = displayName

      // --- Save and return the user.
      const { User } = this.getRepositories()
      await User.save(userToUpdate)
    },
  )
}
