import type { ModuleUser } from '../index'
import { createRoute } from '@unserved/server'

export function userSessionGet(this: ModuleUser) {
  return createRoute(
    {
      name: 'GET /api/session',
    },
    async({ event }) => {
      const user = await this.authenticate(event, { optional: true })
      return { username: user?.user.username }
    },
  )
}
