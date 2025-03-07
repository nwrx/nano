import type { Loose } from '@unshared/types'
import type { ModuleVault } from '../index'
import type { VaultPermission } from './assertVaultPermission'
import { createSchema } from '@unshared/validation'
import { assertVault } from './assertVault'

/** The parser function for the {@linkcode getVaultProjectPermissions} function. */
const GET_VAULT_PROJECT_ASSIGNMENTS_SCHEMA = createSchema({
  vault: assertVault,
})

/** The options to resolve the vault project assignments with. */
export type GetVaultProjectAssignmentsOptions = Loose<ReturnType<typeof GET_VAULT_PROJECT_ASSIGNMENTS_SCHEMA>>

/**
 * Get the list of projects that have access to the vault and their permissions.
 *
 * @param options The options to find the vault project assignments with.
 * @returns The project assignments within the vault.
 * @example await getVaultProjectPermissions({ vault }) // { 'project-1': ['Owner'], ... }
 */
export async function getVaultProjectPermissions(this: ModuleVault, options: GetVaultProjectAssignmentsOptions): Promise<Record<string, VaultPermission[]>> {
  const { vault } = GET_VAULT_PROJECT_ASSIGNMENTS_SCHEMA(options)

  // --- Get the vault project assignments from the database.
  const { VaultProjectAssignment } = this.getRepositories()
  const assignments = await VaultProjectAssignment.find({
    where: { vault },
    relations: { project: true },
    select: { permission: true, project: { name: true } },
  })

  // --- Collect the assignments by project.
  const permissions = new Map<string, VaultPermission[]>()
  for (const { project, permission } of assignments) {
    const { name } = project
    if (!permissions.has(name)) permissions.set(name, [])
    permissions.get(name)!.push(permission)
  }

  // --- Return the assignments by project.
  return Object.fromEntries(permissions)
}
