import type { ModuleUser } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertStringEmail, assertStringNotEmpty, createSchema } from '@unshared/validation'
import { ModuleWorkspace } from '../../workspace'
import { createSession, createUser, setSessionCookie } from '../utils'

export function userSignupWithPassword(this: ModuleUser) {
  return createHttpRoute(
    {
      name: 'POST /api/signup',
      parseBody: createSchema({
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
      if (isSignedIn.user) return this.errors.USER_ALREADY_SIGNED_IN()

      // --- Create the user and session.
      if (password !== passwordConfirm) throw this.errors.USER_PASSWORD_MISMATCH()
      const { user, workspace } = await createUser.call(this, { email, username, password })
      const session = createSession.call(this, event, { user })

      // --- Save all entities in a transaction.
      await this.withTransaction(async() => {
        await User.save(user)
        await UserSession.save(session)
        await Workspace.save(workspace)
      })

      // --- Send the token to the user in a cookie.
      setSessionCookie.call(this, event, session)
    },
  )
}
