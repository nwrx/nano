import type { ModuleUser } from '..'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, createParser } from '@unshared/validation'
import { getUser } from '../utils'

export function userDisable(this: ModuleUser) {
  return createHttpRoute(
    {
      name: 'POST /users/:username/disable',
      parseParameters: createParser({
        username: assertStringNotEmpty,
      }),
    },
    async({ event, parameters }) => {
      const { user } = await this.authenticate(event)
      const { username } = parameters

      // --- Only super administrators can disable users.
      if (!user.isSuperAdministrator) throw this.errors.USER_FORBIDDEN()
      const userToDisable = await getUser.call(this, {
        user,
        username,
        withDeleted: true,
        withDisabled: true,
      })

      // --- Disable the user and save the changes.
      if (userToDisable.disabledAt) throw this.errors.USER_ALREADY_DISABLED()
      const { User } = this.getRepositories()
      userToDisable.disabledAt = new Date()
      await User.save(userToDisable)
    },
  )
}
