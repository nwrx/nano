import type { UserObject } from '../entities'
import type { ModuleUser } from '../index'
import { createHttpRoute } from '@unserved/server'
import { toSlug } from '@unshared/string'
import { assert, createSchema } from '@unshared/validation'
import { setResponseStatus } from 'h3'
import { ModuleWorkspace } from '../../workspace'

export function userCreate(this: ModuleUser) {
  return createHttpRoute(
    {
      name: 'POST /api/users',
      parseBody: createSchema({
        email: [assert.stringNotEmpty, assert.stringEmail],
        username: [assert.stringNotEmpty, assert.stringKebabCase, toSlug],
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

      // --- Save the user to the database and return the serialized user.
      const { user: userToCreate, workspace } = await this.createUser({ username, email })

      // --- Save the user and workspace in a transaction.
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
