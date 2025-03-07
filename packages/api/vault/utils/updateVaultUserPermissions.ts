import type { Loose } from '@unshared/types'
import type { VaultAssignment } from '../entities'
import type { ModuleVault } from '../index'
import { createArrayParser, createSchema } from '@unshared/validation'
import { assertUser } from '../../user'
import { assertVault } from './assertVault'
import { assertVaultPermission } from './assertVaultPermission'

/** The schema for assigning a vault to a user. */
export const UPDATE_VAULT_USER_PERMISSIONS_OPTIONS_SCHEMA = createSchema({
  user: assertUser,
  vault: assertVault,
  assignee: assertUser,
  permissions: createArrayParser(assertVaultPermission),
})

/** The options for assigning a vault to a user. */
export type UpdateVaultUserPermissionsOptions = Loose<ReturnType<typeof UPDATE_VAULT_USER_PERMISSIONS_OPTIONS_SCHEMA>>

/**
 * Assigns a vault to a user. This will allow the user to access the vault
 * and its variables based on the permission assigned to the user.
 *
 * @param options The options for assigning the vault to the user.
 * @returns The new and updated vault assignments for the user.
 * @example updateVaultUserPermissions(options) // [VaultAssignment, ...]
 */
export async function updateVaultUserPermissions(this: ModuleVault, options: UpdateVaultUserPermissionsOptions): Promise<VaultAssignment[]> {
  const { user, assignee, vault, permissions } = UPDATE_VAULT_USER_PERMISSIONS_OPTIONS_SCHEMA(options)

  // --- Get existing assignments for the user.
  const { VaultAssignment } = this.getRepositories()
  const assignments = await VaultAssignment.findBy({ user: assignee, vault })

  // --- Delete existing assignments that are not in the new permissions.
  // --- This is done by setting the `deletedAt` field to the current date.
  for (const assignment of assignments) {
    if (!permissions.includes(assignment.permission))
      assignment.deletedAt = new Date()
  }

  // --- Create new assignments that are not in the existing permissions.
  for (const permission of permissions) {
    if (assignments.some(assignment => assignment.permission === permission)) continue
    const assignment = VaultAssignment.create({ createdBy: user, vault, user: assignee, permission })
    assignments.push(assignment)
  }

  // --- Return the updated assignments.
  return assignments
}
