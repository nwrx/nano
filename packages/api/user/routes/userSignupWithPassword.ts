import type { ModuleUser } from '../index'
import { createRoute } from '@unserved/server'
import { assertStringEmail, assertStringNotEmpty, createSchema } from '@unshared/validation'
import { getHeader, getRequestIP, setCookie } from 'h3'
import { ModuleWorkspace } from '../../workspace'

export function userSignupWithPassword(this: ModuleUser) {
  return createRoute(
    {
      name: 'POST /api/signup',
      body: createSchema({
        email: assertStringEmail,
        username: assertStringNotEmpty,
        password: assertStringNotEmpty,
        passwordConfirm: assertStringNotEmpty,
      }),
    },

    async({ event, body }) => {
      const workspaceModule = this.getModule(ModuleWorkspace)
      const { username, email, password, passwordConfirm } = body
      const { User, UserSession } = this.getRepositories()
      const { Workspace } = workspaceModule.getRepositories()

      // --- Check if the user is already signed in.
      const isSignedIn = await this.authenticate(event, { optional: true })
      if (isSignedIn) return this.errors.USER_ALREADY_SIGNED_IN()

      // --- Create the user if the passwords match.
      if (password !== passwordConfirm) throw this.errors.USER_PASSWORD_MISMATCH()
      const { user, workspace } = await this.createUser({ email, username, password })

      // --- Create a session for the user.
      const address = getRequestIP(event, { xForwardedFor: this.userTrustProxy })
      const userAgent = getHeader(event, 'User-Agent')
      const userSession = this.createSession(user, { address, userAgent })
      const token = this.createSessionToken(userSession)

      // --- Save all entities in a transaction.
      await this.withTransaction(async() => {
        await User.save(user)
        await UserSession.save(userSession)
        await Workspace.save(workspace)
      })

      // --- Send the token to the user in a cookie.
      setCookie(event, this.userSessionCookieName, token, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
        maxAge: (userSession.expiresAt.getTime() - Date.now()) / 1000,
      })
    },
  )
}
