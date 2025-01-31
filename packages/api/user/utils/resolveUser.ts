import type { Loose } from '@unshared/types'
import type { User } from '../entities'
import type { ModuleUser } from '../index'
import { assertBoolean, assertNull, assertStringNotEmpty, assertUndefined, createSchema } from '@unshared/validation'

/** The options to resolve the user. */
const RESOLVE_USER_OPTIONS = createSchema({

  /** The username of the user to resolve. */
  username: assertStringNotEmpty,

  /** The user responsible for resolving the user. */
  user: [[assertUndefined], [createSchema({
    username: assertStringNotEmpty,
    isSuperAdministrator: [[assertNull], [assertBoolean]],
  })]],

  /** Also resolve deleted users. */
  withDeleted: [[assertUndefined], [assertBoolean]],

  /** Also resolve disabled users. */
  withDisabled: [[assertUndefined], [assertBoolean]],

  /** Also resolve the user's profile. */
  withProfile: [[assertUndefined], [assertBoolean]],
})

/** The options to resolve the user. */
export type ResolveUserOptions = Loose<ReturnType<typeof RESOLVE_USER_OPTIONS>>

/**
 * Given a username, resolve the user entity. This is used to find the user
 *
 * @param options The options to resolve the user.
 * @returns The resolved user entity.
 * @example const user = await resolveUser({ username: 'alice', user })
 */
export async function resolveUser(this: ModuleUser, options: ResolveUserOptions): Promise<User> {
  const { username, user, withDisabled, withDeleted, withProfile } = RESOLVE_USER_OPTIONS(options)

  // --- Only super administrators can resolve disabled users.
  if (withDisabled && !user?.isSuperAdministrator) throw this.errors.USER_NOT_ALLOWED()
  if (withDeleted && !user?.isSuperAdministrator) throw this.errors.USER_NOT_ALLOWED()

  // --- Find the user by the username.
  const { User } = this.getRepositories()
  const result = await User.findOne({
    where: { username },
    relations: { profile: withProfile ? { avatar: true } : undefined },
    withDeleted: Boolean(withDeleted),
  })

  // --- Throw an error if the user does not exist.
  if (!result) throw this.errors.USER_NOT_FOUND(username)
  if (!withDisabled && result.disabledAt) throw this.errors.USER_NOT_FOUND(username)
  return result
}
