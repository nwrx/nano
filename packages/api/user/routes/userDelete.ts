import type { ModuleUser } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, createParser } from '@unshared/validation'
import { deleteCookie } from 'h3'
import { ModuleWorkspace } from '../../workspace'
import { getUser } from '../utils'

export function userDelete(this: ModuleUser) {
  return createHttpRoute(
    {
      name: 'DELETE /users/:username',
      parseParameters: createParser({
        username: assertStringNotEmpty,
      }),
    },
    async({ event, parameters }) => this.withTransaction(async() => {
      const workspaceModule = this.getModule(ModuleWorkspace)
      const { user } = await this.authenticate(event)
      const { username } = parameters

      // --- Super administrators can not delete themselves.
      if (user.username === username && user.isSuperAdministrator)
        throw this.errors.USER_UNABLE_TO_DELETE_SUPER_ADMIN()

      // --- Only super administrators and the user itself can delete the user.
      if (user.username !== username && !user.isSuperAdministrator)
        throw this.errors.USER_FORBIDDEN()

      // --- Find the user to remove.
      const { User } = this.getRepositories()
      const { Workspace } = workspaceModule.getRepositories()
      const userToRemove = await getUser.call(this, {
        user,
        username,
        withDisabled: Boolean(user.isSuperAdministrator),
      })

      // --- Find the workspace associated with the user and archive it.
      const workspaceToArchive = await Workspace.findOneByOrFail({ name: username })
      workspaceToArchive.archivedAt = new Date()

      // --- Soft-remove the user and workspace.
      await User.softRemove(userToRemove)
      await Workspace.save(workspaceToArchive)

      // --- In case the user is deleting itself, delete the session cookies.
      if (user.username === username) {
        deleteCookie(event, this.userSessionIdCookieName, { httpOnly: true, sameSite: 'strict', secure: true })
        deleteCookie(event, this.userSessionTokenCookieName, { httpOnly: true, sameSite: 'strict', secure: true })
      }
    }),
  )
}
