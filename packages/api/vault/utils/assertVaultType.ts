import type { Asserted } from '@unshared/types'
import { assert } from '@unshared/validation'

export const VAULT_TYPES = [
  'aws',
  'azure',
  'hashicorp',
  'local',
] as const

/** Asserts that the given value is a valid `Vault` type. */
export const assertVaultType = assert.stringEnum(...VAULT_TYPES)

/** The type of vault. */
export type VaultType = Asserted<typeof assertVaultType>
