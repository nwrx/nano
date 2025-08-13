/* eslint-disable unicorn/no-null */
import type { ModuleUser } from '..'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, createParser } from '@unshared/validation'
import { getUser } from '../utils'

export function userEnable(this: ModuleUser) {
  return createHttpRoute(
    {
      name: 'POST /users/:username/enable',
      parseParameters: createParser({
        username: assertStringNotEmpty,
      }),
    },
    async({ event, parameters }) => {
      const { user } = await this.authenticate(event)
      const { username } = parameters

      // --- Only super administrators can enable users.
      if (!user.isSuperAdministrator) throw this.errors.USER_FORBIDDEN()
      const userToEnable = await getUser.call(this, {
        user,
        username,
        withDeleted: true,
        withDisabled: true,
      })

      // --- Enable the user and save the changes.
      if (!userToEnable.disabledAt) throw this.errors.USER_ALREADY_ENABLED()
      const { User } = this.getRepositories()
      userToEnable.disabledAt = null
      await User.save(userToEnable)
    },
  )
}
