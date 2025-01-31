import type { ModuleUser } from '..'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, createSchema } from '@unshared/validation'
import { setResponseStatus } from 'h3'

export function userDisable(this: ModuleUser) {
  return createHttpRoute(
    {
      name: 'PATCH /api/users/:username/disable',
      parseParameters: createSchema({
        username: assertStringNotEmpty,
      }),
    },
    async({ event, parameters }) => {
      const { user } = await this.authenticate(event)
      const { username } = parameters

      // --- Only super administrators can disable users.
      if (!user.isSuperAdministrator) throw this.errors.USER_NOT_ALLOWED()

      // --- Resolve the user to disable.
      const userToDisable = await this.resolveUser({
        user,
        username,
        withDeleted: true,
        withDisabled: true,
      })

      // --- If the user is already disabled, throw an error.
      if (userToDisable.disabledAt) throw this.errors.USER_ALREADY_DISABLED()

      // --- Disable the user and save the changes.
      const { User } = this.getRepositories()
      userToDisable.disabledAt = new Date()
      await User.save(userToDisable)

      // --- Respond with a 204 status code.
      setResponseStatus(event, 204)
    },
  )
}
