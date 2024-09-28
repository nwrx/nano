import type { ModuleUser } from '../index'
import { createRoute } from '@unserved/server'
import { assertStringNotEmpty, createSchema } from '@unshared/validation'
import { setResponseStatus } from 'h3'
import { ModuleWorkspace } from '../../workspace'

export function userDelete(this: ModuleUser) {
  return createRoute(
    {
      name: 'DELETE /api/users/:username',
      parameters: createSchema({
        username: assertStringNotEmpty,
      }),
    },
    async({ event, parameters }) => {
      const workspaceModule = this.getModule(ModuleWorkspace)
      const { user } = await this.authenticate(event)
      const { username } = parameters

      // --- Only super administrators and the user itself can delete the user.
      if (user.username !== username && !user.isSuperAdministrator)
        throw this.errors.USER_NOT_ALLOWED()

      // --- Resolve the user and workspace to remove.
      const { User } = this.getRepositories()
      const { Workspace } = workspaceModule.getRepositories()
      const userToRemove = await this.resolveUser(username)
      const workspaceToRemove = await Workspace.findOneByOrFail({ name: username })

      // --- Soft-remove the user and workspace.
      await this.withTransaction(async() => {
        await User.softDelete({ id: userToRemove.id })
        await Workspace.softDelete({ id: workspaceToRemove.id })
      })

      // --- Respond with a 204 status code.
      setResponseStatus(event, 204)
    },
  )
}
