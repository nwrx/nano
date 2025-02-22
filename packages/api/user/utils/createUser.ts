import type { ModuleUser } from '../index'

export interface CreateUserOptions {
  email: string
  username: string
}

/**
 * Create a new `User` with the given options. Additionally, the user will be
 * assigned to a new `Workspace` with full access.
 *
 * @param options The options to create the user with.
 * @returns The created user, workspace, and assignment.
 */
export async function createUser(this: ModuleUser, options: CreateUserOptions) {
  const { username, email } = options

  // --- Check if the username or email is already taken.
  const { User, UserProfile } = this.getRepositories()
  const exists = await User.countBy([{ username }, { email }])
  if (exists !== 0) throw this.errors.USER_EMAIL_OR_NAME_TAKEN()

  // --- Create the user and it's associated password and profile.
  const user = User.create({ email, username })
  user.profile = UserProfile.create({ displayName: user.username })
  return user
}
