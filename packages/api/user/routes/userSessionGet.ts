import type { ModuleUser, UserObject } from '..'
import { createHttpRoute } from '@unserved/server'
import { setResponseStatus } from 'h3'
import { getUser } from '../utils'

export function userSessionGet(this: ModuleUser) {
  return createHttpRoute(
    {
      name: 'GET /api/session',
    },
    async({ event }): Promise<UserObject | void> => {
      const session = await this.authenticate(event, { optional: true })
      if (!session) {
        setResponseStatus(event, 204)
        return
      }

      // --- Get the user assigned to the session and return the user object.
      const user = await getUser.call(this, { user: session.user, username: session.user.username, withProfile: true })
      if (!user.profile) throw new Error('User profile not found')
      return user.serialize({ withProtected: true })
    },
  )
}
