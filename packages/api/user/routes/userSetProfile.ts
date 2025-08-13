import type { ModuleUser } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertString, assertStringNotEmpty, assertUndefined, createParser } from '@unshared/validation'
import { getUser } from '../utils'

export function userSetProfile(this: ModuleUser) {
  return createHttpRoute(
    {
      name: 'PUT /users/:username/profile',
      parseParameters: createParser({
        username: assertStringNotEmpty,
      }),
      parseBody: createParser({
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
        throw this.errors.USER_FORBIDDEN()

      // --- Find the user by the ID.
      const userToUpdate = await getUser.call(this, { user, username, withProfile: true })
      if (body.displayName !== undefined) userToUpdate.profile!.displayName = body.displayName
      if (body.biography !== undefined) userToUpdate.profile!.biography = body.biography
      if (body.company !== undefined) userToUpdate.profile!.company = body.company
      if (body.website !== undefined) userToUpdate.profile!.website = body.website

      // --- Save and return the user.
      const { User } = this.getRepositories()
      await User.save(userToUpdate)
    },
  )
}
