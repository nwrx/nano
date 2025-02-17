import type { Asserted } from '@unshared/types'
import { assert } from '@unshared/validation'

export const VAULT_PERMISSIONS = [
  'Owner',
  'Write',
  'Read',
  'Use',
] as const

/** Asserts that the given value is a valid `Vault` permission. */
export const assertVaultPermission = assert.stringEnum(...VAULT_PERMISSIONS)

/** The permission that a user has on a vault. */
export type VaultPermission = Asserted<typeof assertVaultPermission>
