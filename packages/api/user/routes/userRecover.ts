import type { UUID } from 'node:crypto'
import type { ModuleUser } from '../index'
import { createRoute } from '@unserved/server'
import { assertStringNotEmpty, createSchema } from '@unshared/validation'
import { getHeader, getRequestIP, setCookie, setResponseHeader } from 'h3'

export function userRecover(this: ModuleUser) {
  return createRoute(
    {
      name: 'POST /api/recover',
      body: createSchema({
        username: assertStringNotEmpty,
        password: assertStringNotEmpty,
        passwordConfirm: assertStringNotEmpty,
        token: assertStringNotEmpty,
      }),
    },

    async({ event, body }) => {
      const { token, username } = body

      // --- Get the IP address and user agent.
      const requestIp = getRequestIP(event, { xForwardedFor: this.userTrustProxy })
      const userAgent = getHeader(event, 'User-Agent')
      if (!requestIp || !userAgent) throw this.errors.USER_MISSING_HEADER()
      const address = requestIp.split(':')[0]

      // --- Decrypt the token and find the recovery request.
      const requestId = this.decryptToken(token)
      const request = await this.entities.UserRecovery.findOne({
        where: { id: requestId as UUID },
        relations: { user: true },
      })

      // --- Check if the recovery request is valid.
      if (!request) throw this.errors.USER_RECOVERY_INVALID()
      if (request.user.username !== username) throw this.errors.USER_RECOVERY_INVALID()
      if (request.user.deletedAt) throw this.errors.USER_RECOVERY_INVALID()
      if (request.user.disabledAt) throw this.errors.USER_RECOVERY_INVALID()
      if (request.address !== address) throw this.errors.USER_RECOVERY_INVALID()
      if (request.userAgent !== userAgent) throw this.errors.USER_RECOVERY_INVALID()
      if (request.expiresAt < new Date()) throw this.errors.USER_RECOVERY_EXPIRED()

      // --- Set the new password for the user.
      const user = request.user
      await user.setPassword(body.password)
      await user.save()

      // --- Create a session for the user and return it's associated token.
      const userSession = this.createSession(event, user)
      await userSession.save()
      const sessionToken = this.createSessionToken(userSession)
      request.consumedAt = new Date()
      await request.save()

      // --- Set the response status, content type, and user session cookie.
      setResponseHeader(event, 'Content-Type', 'text/plain')
      setCookie(event, this.userSessionCookieName, sessionToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
        maxAge: (userSession.expiresAt.getTime() - Date.now()) / 1000,
      })
    },
  )
}
