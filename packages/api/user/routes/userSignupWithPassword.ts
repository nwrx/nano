import type { ModuleUser } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertStringEmail, assertStringNotEmpty, createParser } from '@unshared/validation'
import { createSession, registerUser } from '../utils'

export function userSignupWithPassword(this: ModuleUser) {
  return createHttpRoute(
    {
      name: 'POST /api/signup',
      parseBody: createParser({
        email: assertStringEmail,
        username: assertStringNotEmpty,
        password: assertStringNotEmpty,
        passwordConfirm: assertStringNotEmpty,
      }),
    },

    async({ event, body }) => this.withTransaction(async() => {
      const { username, email, password, passwordConfirm } = body

      // --- Check if the user is already signed in and if the passwords match.
      const isSignedIn = await this.authenticate(event, { optional: true })
      if (isSignedIn.user) return this.errors.USER_ALREADY_SIGNED_IN()
      if (password !== passwordConfirm) throw this.errors.USER_PASSWORD_MISMATCH()

      // --- Create the user and the session.
      const { user } = await registerUser.call(this, { username, email, password })
      const session = await createSession.call(this, event, { user })

      // --- Save the session.
      const { UserSession } = this.getRepositories()
      await UserSession.save(session)
    }),
  )
}
