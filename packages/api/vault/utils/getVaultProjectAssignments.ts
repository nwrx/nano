import type { Loose } from '@unshared/types'
import type { ModuleVault } from '../index'
import type { VaultPermission } from './assertVaultPermission'
import { createSchema } from '@unshared/validation'
import { assertVault } from './assertVault'

/** A representation of vault permissions assigned to a project. */
export interface VaultProjectPermissions {
  project: string
  permissions: VaultPermission[]
}

/** The parser function for the {@linkcode getVaultProjectAssignments} function. */
const GET_VAULT_PROJECT_ASSIGNMENTS_OPTIONS_SCHEMA = createSchema({
  vault: assertVault,
})

/** The options to resolve the vault project assignments with. */
export type GetVaultProjectAssignmentsOptions = Loose<ReturnType<typeof GET_VAULT_PROJECT_ASSIGNMENTS_OPTIONS_SCHEMA>>

/**
 * Resolve the {@linkcode VaultProjectPermissions} for the given vault. The function will query the database
 * for every project assignment within the vault and return the assignments by project.
 *
 * @param options The options to find the vault project assignments with.
 * @returns The {@linkcode VaultProjectPermissions} within the vault.
 * @example await getVaultProjectAssignments({ vault }) // [{ project: 'project-1',  permissions: ['Read'] }, ...]
 */
export async function getVaultProjectAssignments(this: ModuleVault, options: GetVaultProjectAssignmentsOptions): Promise<VaultProjectPermissions[]> {
  const { vault } = GET_VAULT_PROJECT_ASSIGNMENTS_OPTIONS_SCHEMA(options)

  // --- Get the vault project assignments from the database.
  const { VaultProjectAssignment } = this.getRepositories()
  const assignments = await VaultProjectAssignment.find({ where: { vault }, relations: { project: true } })

  // --- Collect the assignments by project.
  const assignmentsByProject: Record<string, VaultProjectPermissions> = {}
  for (const { project, permission } of assignments) {
    const { name } = project
    if (!assignmentsByProject[name]) assignmentsByProject[name] = { project: name, permissions: [] }
    assignmentsByProject[name].permissions.push(permission)
  }

  // --- Return the assignments by project.
  return Object.values(assignmentsByProject)
}
