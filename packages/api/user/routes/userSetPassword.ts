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
      const { User, UserPassword } = this.getRepositories()
      const { username } = parameters
      const { newPassword, oldPassword, oldPasswordConfirm } = body
      const { user } = await this.authenticate(event)

      // --- If the request is made by a user other than the super administrator, return an error.
      if (user.username !== username && !user.isSuperAdministrator)
        throw this.errors.USER_NOT_ALLOWED()

      // --- Check if the old password matches the user's password.
      if (oldPassword !== oldPasswordConfirm) throw this.errors.USER_PASSWORD_MISMATCH()

      // --- Expire the old password.
      const oldPasswordEntity = await UserPassword.findOne({ where: { user } })
      if (oldPasswordEntity) oldPasswordEntity.expiresAt = new Date()

      // --- Create a new password entity and add it to the user.
      const userToSave = await this.resolveUser(username, { passwords: true })
      const newPasswordEntity = await this.createPassword(userToSave, newPassword)
      userToSave.passwords!.push(newPasswordEntity)

      // --- Save the password entities.
      await this.withTransaction(async() => {
        await User.save(userToSave)
        if (oldPasswordEntity) await UserPassword.save(oldPasswordEntity)
      })
    },
  )
}
