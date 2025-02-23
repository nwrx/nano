import type { ModuleUser } from '..'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, createSchema } from '@unshared/validation'
import { getUser } from '../utils'

export function userVerify(this: ModuleUser) {
  return createHttpRoute(
    {
      name: 'PATCH /api/users/:username/verify',
      parseParameters: createSchema({
        username: assertStringNotEmpty,
      }),
    },
    async({ event, parameters }) => {
      const { user } = await this.authenticate(event)
      const { username } = parameters

      // --- Only super administrators can verify users.
      if (!user.isSuperAdministrator) throw this.errors.USER_FORBIDDEN()
      const userToVerify = await getUser.call(this, {
        user,
        username,
        withDeleted: true,
        withDisabled: true,
      })

      // --- Verify the user and save the changes.
      if (userToVerify.verifiedAt) throw this.errors.USER_ALREADY_VERIFIED()
      const { User } = this.getRepositories()
      userToVerify.verifiedAt = new Date()
      await User.save(userToVerify)
    },
  )
}
