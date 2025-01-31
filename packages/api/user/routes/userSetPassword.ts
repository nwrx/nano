import type { ModuleUser } from '../index'
import { createRoute } from '@unserved/server'
import { assertStringNotEmpty, createSchema } from '@unshared/validation'

export function userSetPassword(this: ModuleUser) {
  return createRoute(
    {
      name: 'PUT /api/users/:username/password',
      parameters: createSchema({
        username: assertStringNotEmpty,
      }),
      body: createSchema({
        oldPassword: assertStringNotEmpty,
        newPassword: assertStringNotEmpty,
        newPasswordConfirm: assertStringNotEmpty,
      }),
    },
    async({ event, parameters, body }): Promise<void> => {
      const { username } = parameters
      const { oldPassword, newPassword, newPasswordConfirm } = body
      const { user } = await this.authenticate(event)

      // --- If the request is made by a user other than the super administrator, return an error.
      if (user.username !== username && !user.isSuperAdministrator)
        throw this.errors.USER_NOT_ALLOWED()

      // --- Check the old password.
      if (newPassword !== newPasswordConfirm) throw this.errors.USER_PASSWORD_MISMATCH()
      const isOldPasswordValid = await this.checkPassword(user, oldPassword)
      if (!isOldPasswordValid) throw this.errors.USER_WRONG_PASSWORD()

      // --- Expire the old password.
      const { User } = this.getRepositories()
      const userToSave = await this.resolveUser({ user, username })
      for (const password of userToSave.passwords!) {
        if (password.expiredAt) continue
        password.expiredAt = new Date()
      }

      // --- Append the new password to the user's password history.
      const newPasswordEntity = await this.createPassword(newPassword)
      userToSave.passwords!.push(newPasswordEntity)

      // --- Save the password entities.
      await User.save(userToSave)
    },
  )
}
