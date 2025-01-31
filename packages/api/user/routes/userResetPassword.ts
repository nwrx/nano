import type { ModuleUser } from '../index'
import { createRoute } from '@unserved/server'
import { assertStringEmail, createSchema } from '@unshared/validation'
import { getHeader, getRequestIP } from 'h3'
import { createCipheriv, createHash } from 'node:crypto'

export function userResetPassword(this: ModuleUser) {
  return createRoute(
    {
      name: 'POST /api/:username/reset-password',
      parameters: createSchema({
        username: assertStringEmail,
      }),
    },

    async({ event, parameters }) => {
      const { username } = parameters

      // --- Find the user by email. Allowing us to send a reset password email.
      // --- If user was not found, don't do anything to avoid leaking information.
      const { User, UserRecovery } = this.getRepositories()
      const user = await User.findOneBy({ username })
      if (!user) throw this.errors.USER_NOT_FOUND(username)
      if (user.disabledAt) throw this.errors.USER_NOT_FOUND(username)
      if (user.deletedAt) throw this.errors.USER_NOT_FOUND(username)

      // --- Get the IP address and user agent.
      const requestIp = getRequestIP(event, { xForwardedFor: this.userTrustProxy })
      const userAgent = getHeader(event, 'User-Agent')
      if (!requestIp || !userAgent) throw this.errors.USER_MISSING_HEADER()
      const address = requestIp.split(':')[0]

      // --- Create a recovery request for the user.
      const request = UserRecovery.create()
      request.user = user
      request.address = address
      request.userAgent = userAgent
      request.expiresAt = new Date(Date.now() + this.userRecoveryDuration)

      // --- Create a token for the recovery request.
      const iv = Buffer.alloc(16, 0)
      const key = createHash('sha256').update(this.userSecretKey).digest()
      const token = createCipheriv(this.userCypherAlgorithm, key, iv).update(request.id).toString('hex')

      // --- Pass the recovery request to the user defined handler.
      if (typeof this.onPasswordRecovery === 'function')
        await this.onPasswordRecovery(user.username, token)
      else if (process.env.NODE_ENV === 'development')
        this.logger.warn(`Recovery token for "${user.username}" : ${token}`)
    },
  )
}
