import type { ModuleUser } from '../index'
import { ModuleWorkspace } from '../../workspace'

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
  const { User } = this.getRepositories()
  const exists = await User.findOne({ where: [{ username }, { email }] })
  if (exists) throw this.errors.USER_EMAIL_TAKEN()

  // --- Create the user.
  const user = User.create({ email, username })
  if (password) await user.setPassword(password)

  // --- Create the associated workspace.
  const workspace = await workspaceModule.createWorkspace({ name: user.username, isPublic: false, user })
  return { user, workspace }
}
