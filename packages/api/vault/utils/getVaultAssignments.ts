import type { Loose } from '@unshared/types'
import type { ModuleVault } from '../index'
import type { VaultPermission } from './assertVaultPermission'
import { createSchema } from '@unshared/validation'
import { assertVault } from './assertVault'

/** A map of the vault assignments by user. */
export interface VaultUserPermissions {
  username: string
  displayName: string
  permissions: VaultPermission[]
}

/** The parser function for the {@linkcode getVaultAssignments} function. */
const GET_VAULT_ASSIGNMENTS_OPTIONS_SCHEMA = createSchema({
  vault: assertVault,
})

/** The options to resolve the vault assignments with. */
export type GetVaultAssignmentsOptions = Loose<ReturnType<typeof GET_VAULT_ASSIGNMENTS_OPTIONS_SCHEMA>>

/**
 * Resolve the {@linkcode VaultUserPermissions} for the given vault. The function will query the database
 * for every assignment within the vault and return the assignments by user.
 *
 * @param options The options to find the vault assignments with.
 * @returns The {@linkcode VaultUserPermissions} within the vault.
 * @example await getVaultAssignments({ vault }) // [{ username: 'user-1', displayName: 'User 1', permissions: ['Owner'] }, ...]
 */
export async function getVaultAssignments(this: ModuleVault, options: GetVaultAssignmentsOptions): Promise<VaultUserPermissions[]> {
  const { vault } = GET_VAULT_ASSIGNMENTS_OPTIONS_SCHEMA(options)

  // --- Get the vault assignments from the database.
  const { VaultAssignment } = this.getRepositories()
  const assignments = await VaultAssignment.find({ where: { vault }, relations: { user: { profile: true } } })

  // --- Collect the assignments by user.
  const assignmentsByUser: Record<string, VaultUserPermissions> = {}
  for (const { user, permission } of assignments) {
    const { username, profile } = user
    const { displayName } = profile!
    if (!assignmentsByUser[username]) assignmentsByUser[username] = { username, displayName, permissions: [] }
    assignmentsByUser[username].permissions.push(permission)
  }

  // --- Return the assignments by user.
  return Object.values(assignmentsByUser)
}
