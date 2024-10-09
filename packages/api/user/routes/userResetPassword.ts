import type { ModuleUser } from '../index'
import { createRoute } from '@unserved/server'
import { assertStringEmail, createSchema } from '@unshared/validation'
import { createCipheriv, createHash } from 'node:crypto'

export function userResetPassword(this: ModuleUser) {
  return createRoute(
    {
      name: 'POST /api/:username/reset-password',
      parameters: createSchema({
        username: assertStringEmail,
      }),
    },

    async({ parameters }) => {
      const { username } = parameters

      // --- Create a recovery request for the user.
      const { UserRecovery } = this.getRepositories()
      const user = await this.resolveUser({ username })
      const expiredAt = new Date(Date.now() + this.userRecoveryDuration)
      const request = UserRecovery.create({ user, expiredAt })

      // --- Create a token for the recovery request.
      const iv = Buffer.alloc(16, 0)
      const key = createHash('sha256').update(this.userSecretKey).digest()
      const token = createCipheriv(this.userCypherAlgorithm, key, iv).update(request.id).toString('hex')

      // --- Pass the recovery request to the user defined handler.
      if (process.env.NODE_ENV === 'development')
        this.logger.warn(`Recovery token for "${user.username}" : ${token}`)
    },
  )
}
