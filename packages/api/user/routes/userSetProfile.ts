import type { ModuleUser } from '../index'
import { createRoute } from '@unserved/server'
import { assertString, assertStringNotEmpty, assertUndefined, createSchema } from '@unshared/validation'

export function userSetProfile(this: ModuleUser) {
  return createRoute(
    {
      name: 'PUT /api/users/:username/profile',
      parameters: createSchema({
        username: assertStringNotEmpty,
      }),
      body: createSchema({
        displayName: [[assertUndefined], [assertStringNotEmpty]],
        biography: [[assertUndefined], [assertString]],
        company: [[assertUndefined], [assertString]],
        website: [[assertUndefined], [assertString]],
      }),
    },
    async({ event, parameters, body }): Promise<void> => {
      const { username } = parameters
      const { user } = await this.authenticate(event)

      // --- Check if the user is allowed to update the profile.
      if (user.username !== username && !user.isSuperAdministrator)
        throw this.errors.USER_NOT_ALLOWED()

      // --- Find the user by the ID.
      const userToUpdate = await this.resolveUser(username, { profile: true })
      if (!userToUpdate.profile) throw new Error('Profile not found.')
      if (body.displayName !== undefined) userToUpdate.profile.displayName = body.displayName
      if (body.biography !== undefined) userToUpdate.profile.biography = body.biography
      if (body.company !== undefined) userToUpdate.profile.company = body.company
      if (body.website !== undefined) userToUpdate.profile.website = body.website

      // --- Save and return the user.
      const { User } = this.getRepositories()
      await User.save(userToUpdate)
    },
  )
}
