import type { ModuleUser } from '../index'
import { createHttpRoute } from '@unserved/server'
import { deleteCookie } from 'h3'

export function userSignout(this: ModuleUser) {
  return createHttpRoute(
    {
      name: 'DELETE /session',
    },
    async({ event }) => {
      const session = await this.authenticate(event)

      // --- Soft-remove the session.
      const { UserSession } = this.getRepositories()
      await UserSession.softRemove(session)

      // --- Delete the session cookies.
      deleteCookie(event, this.sessionIdCookieName, { httpOnly: true, sameSite: 'strict', secure: true })
      deleteCookie(event, this.sessionTokenCookieName, { httpOnly: true, sameSite: 'strict', secure: true })
    },
  )
}
