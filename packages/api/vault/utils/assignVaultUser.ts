import type { Loose } from '@unshared/types'
import type { ModuleVault } from '../index'
import { createSchema } from '@unshared/validation'
import { assertUser } from '../../user'
import { assertWorkspace } from '../../workspace'
import { assertVault } from './assertVault'
import { assertVaultPermission } from './assertVaultPermission'

/** The schema for assigning a vault to a user. */
export const ASSIGN_VAULT_OPTIONS_SCHEMA = createSchema({
  user: assertUser,
  assignee: assertUser,
  workspace: assertWorkspace,
  vault: assertVault,
  permission: assertVaultPermission,
})

/** The options for assigning a vault to a user. */
export type AssignVaultOptions = Loose<ReturnType<typeof ASSIGN_VAULT_OPTIONS_SCHEMA>>

/**
 * Assigns a vault to a user. This will allow the user to access the vault
 * and its variables based on the permission assigned to the user.
 *
 * @param options The options for assigning the vault to the user.
 * @returns The vault assignment that was created.
 * @example assignVaultUser(options) // VaultAssignment { user, assignee, vault, permission }
 */
export async function assignVaultUser(this: ModuleVault, options: AssignVaultOptions) {
  const { user, assignee, vault, workspace, permission } = ASSIGN_VAULT_OPTIONS_SCHEMA(options)

  // --- Check if the user is already assigned with the permission.
  const { VaultAssignment } = this.getRepositories()
  const exists = await VaultAssignment.countBy({ user: assignee, vault, permission })
  if (exists) throw this.errors.VAULT_USER_ALREADY_ASSIGNED(workspace.name, vault.name, assignee.username)

  // --- Create and return the vault assignment.
  return VaultAssignment.create({ createdBy: user, user: assignee, vault, permission })
}
