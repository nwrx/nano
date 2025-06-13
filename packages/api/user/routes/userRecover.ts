import type { UUID } from 'node:crypto'
import type { ModuleUser } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, createParser, EXP_UUID } from '@unshared/validation'
import { createDecipheriv, createHash } from 'node:crypto'
import { createPassword, createSession } from '../utils'

export function userRecover(this: ModuleUser) {
  return createHttpRoute(
    {
      name: 'POST /api/users/:username/recover',
      parseParameters: createParser({
        username: assertStringNotEmpty,
      }),
      parseBody: createParser({
        token: assertStringNotEmpty,
        newPassword: assertStringNotEmpty,
        newPasswordConfirm: assertStringNotEmpty,
      }),
    },
    async({ event, parameters, body }) => this.withTransaction(async() => {
      const { username } = parameters
      const { token, newPassword, newPasswordConfirm } = body

      // --- Check if the passwords match.
      if (newPassword !== newPasswordConfirm) throw this.errors.USER_PASSWORD_MISMATCH()

      // --- Decrypt the token and find the recovery request.
      const iv = Buffer.alloc(16, 0)
      const key = createHash('sha256').update(this.userSecretKey).digest()
      const id = createDecipheriv(this.userCypherAlgorithm, key, iv).update(token, 'hex', 'utf8').toString()
      const isUuid = EXP_UUID.test(id)
      if (!isUuid) throw this.errors.USER_RECOVERY_INVALID()

      // --- Find the user recovery request by the token.
      const { UserRecovery } = this.getRepositories()
      const recovery = await UserRecovery.findOne({
        where: { id: id as UUID },
        relations: { user: true },
      })

      // --- Check if the recovery request is valid.
      if (!recovery) throw this.errors.USER_RECOVERY_INVALID()
      if (!recovery.user) throw this.errors.USER_RECOVERY_INVALID()
      if (recovery.user.disabledAt) throw this.errors.USER_DISABLED()
      if (recovery.consumedAt) throw this.errors.USER_RECOVERY_INVALID()
      if (recovery.user.username !== username) throw this.errors.USER_RECOVERY_INVALID()
      if (recovery.expiredAt < new Date()) throw this.errors.USER_RECOVERY_EXPIRED()
      recovery.consumedAt = new Date()
      await UserRecovery.save(recovery)

      // --- Set the new password for the user.
      const { UserPassword } = this.getRepositories()
      const password = await createPassword.call(this, { password: newPassword, user: recovery.user })
      await UserPassword.save(password)

      // --- Create a new session for the user and sign them in.
      await createSession.call(this, event, { user: recovery.user })
    }),
  )
}
