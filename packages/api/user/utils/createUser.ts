import type { ModuleUser } from '../index'
import { ModuleWorkspace } from '../../workspace'
import { createPassword } from './createPassword'

export interface CreateUserOptions {
  email: string
  username: string
  password?: string
}

/**
 * Create a new `User` with the given options. Additionally, the user will be
 * assigned to a new `Workspace` with full access.
 *
 * @param options The options to create the user with.
 * @returns The created user, workspace, and assignment.
 */
export async function createUser(this: ModuleUser, options: CreateUserOptions) {
  const workspaceModule = this.getModule(ModuleWorkspace)
  const { username, password, email } = options

  // --- Check if the username or email is already taken.
  const { User, UserProfile } = this.getRepositories()
  const exists = await User.findOne({ where: [{ username }, { email }] })
  if (exists) throw this.errors.USER_EMAIL_OR_NAME_TAKEN()

  // --- Create the user and it's associated workspace, password and profile.
  const user = User.create({ email, username })
  if (password) user.passwords = [await createPassword.call(this, password)]
  const workspace = await workspaceModule.createWorkspace({ user, name: user.username, isPublic: true })
  user.profile = UserProfile.create({ displayName: user.username })

  // --- Return the entities to save.
  return { user, workspace }
}
