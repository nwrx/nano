import type { Loose } from '@unshared/types'
import type { VaultProjectAssignment } from '../entities'
import type { ModuleVault } from '../index'
import { createArrayParser, createSchema } from '@unshared/validation'
import { assertProject } from '../../project'
import { assertUser } from '../../user'
import { assertVault } from './assertVault'
import { assertVaultPermission } from './assertVaultPermission'

/** The schema for assigning a vault to a project. */
export const UPDATE_VAULT_PROJECT_PERMISSIONS_OPTIONS_SCHEMA = createSchema({
  user: assertUser,
  vault: assertVault,
  project: assertProject,
  permissions: createArrayParser(assertVaultPermission),
})

/** The options for assigning a vault to a project. */
export type UpdateVaultProjectPermissionsOptions = Loose<ReturnType<typeof UPDATE_VAULT_PROJECT_PERMISSIONS_OPTIONS_SCHEMA>>

/**
 * Assigns a vault to a project. This will allow the project to access the vault
 * and its variables based on the permission assigned to the project.
 *
 * @param options The options for assigning the vault to the project.
 * @returns The new and updated vault assignments for the project.
 * @example updateVaultProjectPermissions(options) // [VaultProjectAssignment, ...]
 */
export async function updateVaultProjectPermissions(this: ModuleVault, options: UpdateVaultProjectPermissionsOptions): Promise<VaultProjectAssignment[]> {
  const { user, vault, project, permissions } = UPDATE_VAULT_PROJECT_PERMISSIONS_OPTIONS_SCHEMA(options)

  // --- Get existing assignments for the project.
  const { VaultProjectAssignment } = this.getRepositories()
  const assignments = await VaultProjectAssignment.findBy({ project, vault })

  // --- Delete existing assignments that are not in the new permissions.
  // --- This is done by setting the `deletedAt` field to the current date.
  for (const assignment of assignments) {
    if (!permissions.includes(assignment.permission))
      assignment.deletedAt = new Date()
  }

  // --- Create new assignments that are not in the existing permissions.
  for (const permission of permissions) {
    if (assignments.some(assignment => assignment.permission === permission)) continue
    const assignment = VaultProjectAssignment.create({ createdBy: user, vault, project, permission })
    assignments.push(assignment)
  }

  // --- Return the updated assignments.
  return assignments
}
