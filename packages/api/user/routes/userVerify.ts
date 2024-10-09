import type { ModuleUser } from '..'
import { createRoute } from '@unserved/server'
import { assertStringNotEmpty, createSchema } from '@unshared/validation'
import { setResponseStatus } from 'h3'

export function userVerify(this: ModuleUser) {
  return createRoute(
    {
      name: 'PATCH /api/users/:username/verify',
      parameters: createSchema({
        username: assertStringNotEmpty,
      }),
    },
    async({ event, parameters }) => {
      const { user } = await this.authenticate(event)
      const { username } = parameters

      // --- Only super administrators can verify users.
      if (!user.isSuperAdministrator) throw this.errors.USER_NOT_ALLOWED()

      // --- Resolve the user to verify.
      const userToVerify = await this.resolveUser({
        user,
        username,
        withDeleted: true,
        withDisabled: true,
      })

      // --- If the user is already verified, throw an error.
      if (userToVerify.verifiedAt) throw this.errors.USER_ALREADY_VERIFIED()

      // --- Verify the user and save the changes.
      const { User } = this.getRepositories()
      userToVerify.verifiedAt = new Date()
      await User.save(userToVerify)

      // --- Respond with a 204 status code.
      setResponseStatus(event, 204)
    },
  )
}
