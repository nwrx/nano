import type { ModuleUser } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, createParser } from '@unshared/validation'
import { checkPassword, createPassword, getUser } from '../utils'

export function userSetPassword(this: ModuleUser) {
  return createHttpRoute(
    {
      name: 'PUT /api/users/:username/password',
      parseParameters: createParser({
        username: assertStringNotEmpty,
      }),
      parseBody: createParser({
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
        throw this.errors.USER_FORBIDDEN()

      // --- Check the old password.
      if (newPassword !== newPasswordConfirm) throw this.errors.USER_PASSWORD_MISMATCH()
      const isOldPasswordValid = await checkPassword.call(this, user, oldPassword)
      if (!isOldPasswordValid) throw this.errors.USER_WRONG_PASSWORD()

      // --- Expire the old password.
      const { User } = this.getRepositories()
      const userToSave = await getUser.call(this, { user, username })
      for (const password of userToSave.passwords!) {
        if (password.expiredAt) continue
        password.expiredAt = new Date()
      }

      // --- Append the new password to the user's password history.
      const newPasswordEntity = await createPassword.call(this, newPassword)
      userToSave.passwords!.push(newPasswordEntity)

      // --- Save the password entities.
      await User.save(userToSave)
    },
  )
}
