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
        newPassword: assertStringNotEmpty,
        oldPassword: assertStringNotEmpty,
        oldPasswordConfirm: assertStringNotEmpty,
      }),
    },
    async({ event, parameters, body }): Promise<void> => {
      const { username } = parameters
      const { newPassword, oldPassword, oldPasswordConfirm } = body
      const { user } = await this.authenticate(event)

      // --- If the request is made by a user other than the super administrator, return an error.
      if (user.username !== username && !user.isSuperAdministrator)
        throw this.errors.USER_NOT_ALLOWED()

      // --- Check the old password.
      if (oldPassword !== oldPasswordConfirm) throw this.errors.USER_PASSWORD_MISMATCH()
      const isOldPasswordValid = await this.checkPassword(user, oldPassword)
      if (!isOldPasswordValid) throw this.errors.USER_WRONG_PASSWORD()

      // --- Expire the old password.
      const { User } = this.getRepositories()
      const userToSave = await this.resolveUser(username, { passwords: true })
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
