import type { UserObject } from '../entities'
import type { ModuleUser } from '../index'
import { createRoute } from '@unserved/server'
import { assertStringNotEmpty, assertStringUuid, assertUndefined, createSchema } from '@unshared/validation'

export function userSetPassword(this: ModuleUser) {
  return createRoute(
    {
      name: 'PUT /api/users/:username',
      parameters: createSchema({
        username: assertStringUuid,
      }),
      body: createSchema({
        oldPassword: [[assertUndefined], [assertStringNotEmpty]],
        password: [[assertUndefined], [assertStringNotEmpty]],
        passwordConfirm: [[assertUndefined], [assertStringNotEmpty]],
      }),
    },
    async({ event, parameters, body }): Promise<UserObject> => {
      const { username } = parameters
      const { password, passwordConfirm } = body
      const response = await this.authenticate(event)
      if (!response.user.isSuperAdministrator) throw this.errors.USER_NOT_ALLOWED()

      // --- Find the user by the ID.
      const user = await this.resolveUser(username)

      // --- Update the password.
      if (password) {
        if (password !== passwordConfirm) throw this.errors.USER_PASSWORD_MISMATCH()
        await user.setPassword(password)
      }

      // --- Save and return the user.
      await user.save()
      return user.serialize()
    },
  )
}
