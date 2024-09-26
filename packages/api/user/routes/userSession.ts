import type { ModuleUser } from '../index'
import { createRoute } from '@unserved/server'

export function userSession(this: ModuleUser) {
  return createRoute(
    {
      name: 'HEAD /api/session',
    },
    async({ event }) => {
      const user = await this.authenticate(event, { optional: true })
      return { username: user?.username }
    },
  )
}
