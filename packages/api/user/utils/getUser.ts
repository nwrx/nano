import type { Loose } from '@unshared/types'
import type { ModuleUser } from '..'
import type { User } from '../entities'
import { assert, createSchema } from '@unshared/validation'
import { assertUser } from './assertUser'

/** The options to resolve the user. */
const GET_USER_OPTIONS_SCHEMA = createSchema({

  /** The username of the user to resolve. */
  username: assert.stringNotEmpty,

  /** The user responsible for resolving the user. */
  user: [[assert.undefined], [assertUser]],

  /** Also resolve deleted users. */
  withDeleted: [[assert.undefined], [assert.boolean]],

  /** Also resolve disabled users. */
  withDisabled: [[assert.undefined], [assert.boolean]],

  /** Also resolve the user's profile. */
  withProfile: [[assert.undefined], [assert.boolean]],
})

/** The options to resolve the user. */
export type GetUserOptions = Loose<ReturnType<typeof GET_USER_OPTIONS_SCHEMA>>

/**
 * Given a username, resolve the user entity. This is used to find the user
 *
 * @param options The options to resolve the user.
 * @returns The resolved user entity.
 * @example const user = await resolveUser({ username: 'alice', user })
 */
export async function getUser(this: ModuleUser, options: GetUserOptions): Promise<User> {
  const { username, user, withDisabled, withDeleted, withProfile } = GET_USER_OPTIONS_SCHEMA(options)

  // --- Only super administrators can resolve disabled users.
  if (user?.isSuperAdministrator !== true) {
    if (withDisabled) throw this.errors.USER_FORBIDDEN()
    if (withDeleted) throw this.errors.USER_FORBIDDEN()
  }

  // --- Find the user by the username.
  const { User } = this.getRepositories()
  const result = await User.findOne({
    where: { username },
    relations: { profile: withProfile ? { avatar: true } : undefined },
    withDeleted: withDeleted === true,
  })

  // --- Throw an error if the user does not exist.
  if (!result) throw this.errors.USER_NOT_FOUND(username)
  if (!withDisabled && result.disabledAt) throw this.errors.USER_NOT_FOUND(username)
  return result
}
