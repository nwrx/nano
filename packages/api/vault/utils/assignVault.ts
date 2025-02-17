import type { Loose } from '@unshared/types'
import type { ModuleVault } from '../index'
import { assertStringUuid, createSchema } from '@unshared/validation'
import { assertVaultPermission } from './assertVaultPermission'

/** The schema for assigning a vault to a user. */
export const ASSIGN_VAULT_OPTIONS_SCHEMA = createSchema({

  /** The user responsible for assigning the vault. */
  user: createSchema({ id: assertStringUuid }),

  /** The user to assign the vault to. */
  assignee: createSchema({ id: assertStringUuid }),

  /** The vault to assign to the user. */
  vault: createSchema({ id: assertStringUuid }),

  /** The permission to assign to the user. */
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
 * @example assignVault(options) // VaultAssignment { user, assignee, vault, permission }
 */
export async function assignVault(this: ModuleVault, options: AssignVaultOptions) {
  const { VaultAssignment } = this.getRepositories()
  const { user, assignee, vault, permission } = ASSIGN_VAULT_OPTIONS_SCHEMA(options)
  const assignment = VaultAssignment.create({ createdBy: user, user: assignee, vault, permission })
  await VaultAssignment.save(assignment)
  return assignment
}
