import type { ModuleUser } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, createSchema } from '@unshared/validation'
import { ModuleWorkspace } from '../../workspace'
import { getUser } from '../utils'

export function userDelete(this: ModuleUser) {
  return createHttpRoute(
    {
      name: 'DELETE /api/users/:username',
      parseParameters: createSchema({
        username: assertStringNotEmpty,
      }),
    },
    async({ event, parameters }) => {
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
      await this.withTransaction(async() => {
        await User.softRemove(userToRemove)
        await Workspace.save(workspaceToArchive)
      })
    },
  )
}
