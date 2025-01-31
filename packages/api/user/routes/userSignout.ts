import type { ModuleUser } from '../index'
import { createRoute } from '@unserved/server'
import { deleteCookie, setResponseStatus } from 'h3'

export function userSignout(this: ModuleUser) {
  return createRoute('DELETE /api/signout', async({ event }) => {
    const { UserSession } = this.getRepositories()
    const { userSession } = await this.authenticate(event)
    await UserSession.softRemove(userSession)
    setResponseStatus(event, 204)
    deleteCookie(event, this.userSessionCookieName)
  })
}
