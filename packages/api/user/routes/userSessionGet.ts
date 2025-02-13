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
      const { user } = await this.authenticate(event, { optional: true })
      if (!user) {
        setResponseStatus(event, 204)
        return
      }

      // --- Get the user assigned to the session and return the user object.
      const result = await getUser.call(this, { user, username: user.username, withProfile: true })
      if (!result.profile) throw new Error('User profile not found')
      return result.serialize({ withProtected: true })
    },
  )
}
