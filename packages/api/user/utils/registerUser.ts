import type { ModuleUser } from '..'
// import type { VaultConfiguration } from '../../vault/utils'
import type { CreateUserOptions } from './createUser'
// import { randomUUID } from 'node:crypto'
// import { ModuleVault } from '../../vault'
import { ModuleWorkspace } from '../../workspace'
import { createPassword } from './createPassword'
import { createUser } from './createUser'

export interface RegisterUserOptions extends CreateUserOptions {
  password?: string
}

export async function registerUser(this: ModuleUser, options: RegisterUserOptions) {
  const moduleWorkspace = this.getModule(ModuleWorkspace)
  // const moduleVault = this.getModule(ModuleVault)
  const { User, UserPassword } = this.getRepositories()
  const { Workspace } = moduleWorkspace.getRepositories()
  // const { Vault } = moduleVault.getRepositories()

  // --- Create the user and it's associated workspace.
  const { username, email, password: clearPassword } = options
  const user = await createUser.call(this, { username, email })
  const password = clearPassword ? await createPassword.call(this, { user, password: clearPassword }) : undefined
  const workspace = await moduleWorkspace.createWorkspace({ user, name: username, isPublic: true })

  // --- Create a local vault for the user.
  // const configuration: VaultConfiguration<'local'> = { secret: randomUUID(), algorithm: 'aes-256-gcm' }
  // const vault = await moduleVault.createVault({ user, workspace, configuration })

  // --- Save and return the user, workspace, and vault.
  return this.withTransaction(async() => {
    await User.save(user)
    if (password) await UserPassword.save(password)
    await Workspace.save(workspace)
    // await Vault.save(vault)
    return { user, workspace /* vault */ }
  })
}
