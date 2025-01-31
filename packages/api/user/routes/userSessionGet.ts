import type { ModuleUser, UserObject } from '..'
import { createRoute } from '@unserved/server'

export function userSessionGet(this: ModuleUser) {
  return createRoute(
    {
      name: 'GET /api/session',
    },
    async({ event }): Promise<Partial<UserObject>> => {
      const session = await this.authenticate(event, { optional: true })
      if (!session) return {}

      const user = await this.resolveUser({ username: session.user.username, withProfile: true })
      if (!user.profile) throw new Error('User profile not found')
      return user.serialize({
        withProtected: true,
      })
    },
  )
}
