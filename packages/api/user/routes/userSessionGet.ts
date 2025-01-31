import type { ModuleUser } from '../index'
import { createRoute } from '@unserved/server'

interface UserSessionGetResponse {
  email?: string
  username?: string
  avatarUrl?: string
  displayName?: string
}

export function userSessionGet(this: ModuleUser) {
  return createRoute(
    {
      name: 'GET /api/session',
    },
    async({ event }): Promise<UserSessionGetResponse> => {
      const session = await this.authenticate(event, { optional: true })
      if (!session) return {}

      const user = await this.resolveUser(session.user.username, { profile: true })
      if (!user.profile) throw new Error('User profile not found')
      return {
        email: user.email,
        username: user.username,
        displayName: user.profile.displayName,
        avatarUrl: `/api/users/${user.username}/avatar`,
      }
    },
  )
}
