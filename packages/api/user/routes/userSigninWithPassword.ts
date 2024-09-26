import type { ModuleUser } from '../index'
import { createRoute } from '@unserved/server'
import { assertStringNotEmpty, createSchema } from '@unshared/validation'
import { getHeader, getRequestIP, setCookie } from 'h3'

export function userSigninWithPassword(this: ModuleUser) {
  return createRoute(
    {
      name: 'POST /api/signin',
      body: createSchema({
        username: assertStringNotEmpty,
        password: assertStringNotEmpty,
      }),
    },

    async({ event, body }) => {
      const { username, password } = body
      const { User, UserSession } = this.getRepositories()

      // --- Try authenticating the user from the Cookie.
      // --- If successful, do not create a new session.
      const isSignedIn = await this.authenticate(event, { optional: true })
      if (isSignedIn) return

      // --- Get the user by the username and check the password.
      const user = await User.findOne({ where: [
        { username },
        { email: username },
      ] })

      // --- Throw an error if the user is not found or the password is incorrect.
      if (!user) return this.errors.USER_BAD_CREDENTIALS()
      const isPasswordCorrect = await user.checkPassword(password)
      if (!isPasswordCorrect) return this.errors.USER_BAD_CREDENTIALS()

      // --- Create a session for the user.
      const address = getRequestIP(event, { xForwardedFor: this.userTrustProxy })
      const userAgent = getHeader(event, 'User-Agent')
      const userSession = this.createSession(user, { address, userAgent })
      const token = this.createSessionToken(userSession)
      await UserSession.save(userSession)

      // --- Set the response status, content type, and user session cookie.
      setCookie(event, this.userSessionCookieName, token, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
        maxAge: (userSession.expiresAt.getTime() - Date.now()) / 1000,
      })
    },
  )
}
