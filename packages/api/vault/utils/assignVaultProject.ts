import type { Loose } from '@unshared/types'
import type { ModuleVault } from '../index'
import { createSchema } from '@unshared/validation'
import { assertProject } from '../../project'
import { assertUser } from '../../user'
import { assertWorkspace } from '../../workspace'
import { assertVault } from './assertVault'
import { assertVaultPermission } from './assertVaultPermission'

/** The schema for assigning a vault to a project. */
export const ASSIGN_VAULT_PROJECT_OPTIONS_SCHEMA = createSchema({
  user: assertUser,
  workspace: assertWorkspace,
  project: assertProject,
  vault: assertVault,
  permission: assertVaultPermission,
})

/** The options for assigning a vault to a project. */
export type AssignVaultProjectOptions = Loose<ReturnType<typeof ASSIGN_VAULT_PROJECT_OPTIONS_SCHEMA>>

/**
 * Assigns a vault to a project. This will allow the project to access the vault
 * and its variables based on the permission assigned to the project.
 *
 * @param options The options for assigning the vault to the project.
 * @returns The vault project assignment that was created.
 * @example assignVaultProject(options) // VaultProjectAssignment { user, assignee, vault, permission }
 */
export async function assignVaultProject(this: ModuleVault, options: AssignVaultProjectOptions) {
  const { user, vault, workspace, project, permission } = ASSIGN_VAULT_PROJECT_OPTIONS_SCHEMA(options)

  // --- Check if the project is already assigned with the permission.
  const { VaultProjectAssignment } = this.getRepositories()
  const exists = await VaultProjectAssignment.countBy({ vault, project, permission })
  if (exists) throw this.errors.VAULT_USER_ALREADY_ASSIGNED(workspace.name, vault.name, project.name)

  // --- Create and return the vault project assignment.
  return VaultProjectAssignment.create({ createdBy: user, vault, project, permission })
}
