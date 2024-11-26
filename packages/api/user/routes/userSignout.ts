import type { ModuleUser } from '../index'
import { createHttpRoute } from '@unserved/server'
import { deleteCookie, setResponseStatus } from 'h3'

export function userSignout(this: ModuleUser) {
  return createHttpRoute(
    {
      name: 'DELETE /api/session',
    },
    async({ event }) => {
      const { UserSession } = this.getRepositories()
      const session = await this.authenticate(event)
      await UserSession.softRemove(session)
      setResponseStatus(event, 204)
      deleteCookie(event, this.userSessionCookieName)
    },
  )
}
