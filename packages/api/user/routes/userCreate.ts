import type { UserObject } from '../entities'
import type { ModuleUser } from '../index'
import { createHttpRoute } from '@unserved/server'
import { toSlug } from '@unshared/string'
import { assertStringEmail, assertStringKebabCase, createSchema } from '@unshared/validation'
import { setResponseStatus } from 'h3'
import { ModuleWorkspace } from '../../workspace'
import { createUser } from '../utils'

export function userCreate(this: ModuleUser) {
  return createHttpRoute(
    {
      name: 'POST /api/users',
      parseBody: createSchema({
        email: [assertStringEmail],
        username: [assertStringKebabCase, toSlug],
      }),
    },
    async({ event, body }): Promise<UserObject> => {
      const workspaceModule = this.getModule(ModuleWorkspace)
      const { user } = await this.authenticate(event)
      const { User } = this.getRepositories()
      const { Workspace } = workspaceModule.getRepositories()
      const { username, email } = body

      // --- Only super administrators can create users.
      if (!user.isSuperAdministrator) throw this.errors.USER_NOT_ALLOWED()

      // --- Create user and workspace and save them in a transaction in the database.
      const { user: userToCreate, workspace } = await createUser.call(this, { username, email })
      await this.withTransaction(async() => {
        await User.save(userToCreate)
        await Workspace.save(workspace)
      })

      // --- Return the serialized user.
      setResponseStatus(event, 201)
      return userToCreate.serialize()
    },
  )
}
