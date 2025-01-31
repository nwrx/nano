/* eslint-disable unicorn/no-null */
import type { ModuleUser } from '..'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, createSchema } from '@unshared/validation'
import { setResponseStatus } from 'h3'

export function userEnable(this: ModuleUser) {
  return createHttpRoute(
    {
      name: 'PATCH /api/users/:username/enable',
      parseParameters: createSchema({
        username: assertStringNotEmpty,
      }),
    },
    async({ event, parameters }) => {
      const { user } = await this.authenticate(event)
      const { username } = parameters

      // --- Only super administrators can enable users.
      if (!user.isSuperAdministrator) throw this.errors.USER_NOT_ALLOWED()

      // --- Resolve the user to enable.
      const userToEnable = await this.resolveUser({
        user,
        username,
        withDeleted: true,
        withDisabled: true,
      })

      // --- If the user is not disabled, throw an error.
      if (!userToEnable.disabledAt) throw this.errors.USER_ALREADY_ENABLED()

      // --- Enable the user and save the changes.
      const { User } = this.getRepositories()
      userToEnable.disabledAt = null
      await User.save(userToEnable)

      // --- Respond with a 204 status code.
      setResponseStatus(event, 204)
    },
  )
}
