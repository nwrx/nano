import type { ModuleUser, UserObject } from '..'
import { createHttpRoute } from '@unserved/server'
import { deleteCookie, setResponseStatus } from 'h3'
import { authenticate, getUser } from '../utils'

export function userSessionGet(this: ModuleUser) {
  return createHttpRoute(
    {
      name: 'GET /api/session',
    },
    async({ event }): Promise<undefined | UserObject> => {
      try {
        const session = await authenticate.call(this, event, { optional: true })
        if (!session.user) return setResponseStatus(event, 204) as undefined

        // --- Get the user assigned to the session and return the user object.
        const result = await getUser.call(this, { user: session.user, username: session.user.username, withProfile: true })
        if (!result.profile) throw new Error('User profile not found')
        return result.serialize({ withProtected: true })
      }

      // --- If a token was provided but failed to authenticate, return a 401 status
      // --- and reset the session cookie so the client can clear the session.
      catch (error) {
        deleteCookie(event, this.userSessionCookieName, {
          secure: true,
          httpOnly: true,
        })
        throw error
      }
    },
  )
}
