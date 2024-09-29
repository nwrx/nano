import type { ModuleUser } from '../index'
import { createRoute } from '@unserved/server'
import { assertStringNotEmpty, createSchema } from '@unshared/validation'

export function userSigninWithPassword(this: ModuleUser) {
  return createRoute(
    {
      name: 'POST /api/session',
      body: createSchema({
        username: assertStringNotEmpty,
        password: assertStringNotEmpty,
      }),
    },
    async({ event, body }): Promise<void> => {
      const { username, password } = body

      // --- Try authenticating the user from the Cookie.
      // --- If successful, do not create a new session.
      const isSignedIn = await this.authenticate(event, { optional: true })
      if (isSignedIn) return

      // --- Get the user by the username and check the password.
      const { User } = this.getRepositories()
      const user = await User.findOne({ where: [{ username }, { email: username }] })
      if (!user) throw this.errors.USER_BAD_CREDENTIALS()
      if (user.disabledAt) throw this.errors.USER_DISABLED()
      if (user.verifiedAt === null) throw this.errors.USER_NOT_VERIFIED()

      // --- Find and check the user's password.
      const isPasswordCorrect = await this.checkPassword(user, password)
      if (!isPasswordCorrect) throw this.errors.USER_BAD_CREDENTIALS()

      // --- Create a session for the user.
      const { UserSession } = this.getRepositories()
      const session = this.createSession(event)
      await UserSession.save(session)

      // --- Set the response status, content type, and user session cookie.
      this.setSessionCookie(event, session)
    },
  )
}
