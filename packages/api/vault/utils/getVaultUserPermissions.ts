import type { Loose } from '@unshared/types'
import type { ModuleVault } from '../index'
import type { VaultPermission } from './assertVaultPermission'
import { createParser } from '@unshared/validation'
import { assertVault } from './assertVault'

/** The parser function for the {@linkcode getVaultUserPermissions} function. */
const GET_VAULT_USER_PERMISSIONS_SCHEMA = createParser({
  vault: assertVault,
})

/** The options to resolve the vault assignments with. */
export type GetVaultUserPermissionsOptions = Loose<ReturnType<typeof GET_VAULT_USER_PERMISSIONS_SCHEMA>>

/**
 * Get the list of users that have access to the vault and their permissions.
 *
 * @param options The options to find the vault assignments with.
 * @returns The user assignments within the vault.
 * @example await getVaultUserPermissions({ vault }) // { user1: ['Owner'], ... }
 */
export async function getVaultUserPermissions(this: ModuleVault, options: GetVaultUserPermissionsOptions): Promise<Record<string, VaultPermission[]>> {
  const { vault } = GET_VAULT_USER_PERMISSIONS_SCHEMA(options)

  // --- Get the vault assignments from the database.
  const { VaultAssignment } = this.getRepositories()
  const assignments = await VaultAssignment.find({
    where: { vault },
    relations: { user: true },
    select: { permission: true, user: { username: true } },
  })

  // --- Collect the assignments by user.
  const permissions: Record<string, VaultPermission[]> = {}
  for (const { user, permission } of assignments) {
    const { username } = user
    if (!permissions[username]) permissions[username] = []
    permissions[username].push(permission)
  }

  // --- Return the assignments by user.
  return permissions
}
