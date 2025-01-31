import type { UUID } from 'node:crypto'
import type { ModuleUser } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, createSchema, EXP_UUID } from '@unshared/validation'
import { createDecipheriv, createHash } from 'node:crypto'

export function userRecover(this: ModuleUser) {
  return createHttpRoute(
    {
      name: 'POST /api/users/:username/recover',
      parseParameters: createSchema({
        username: assertStringNotEmpty,
      }),
      parseBody: createSchema({
        token: assertStringNotEmpty,
        newPassword: assertStringNotEmpty,
        newPasswordConfirm: assertStringNotEmpty,
      }),
    },
    async({ event, parameters, body }) => {
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

      // --- Set the new password for the user.
      const password = await this.createPassword(newPassword, { user: recovery.user })
      const session = this.createSession(event, { user: recovery.user })

      const { UserPassword, UserSession } = this.getRepositories()
      await this.withTransaction(async() => {
        await UserSession.save(session)
        await UserPassword.save(password)
        await UserRecovery.save(recovery)
      })

      // --- Set the response status, content type, and user session cookie.
      this.setSessionCookie(event, session)
    },
  )
}
