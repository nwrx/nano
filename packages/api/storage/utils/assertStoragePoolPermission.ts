import type { Asserted } from '@unshared/types'
import { assert } from '@unshared/validation'

export const STORAGE_POOL_PERMISSIONS = [
  'Owner',
  'Write',
  'Read',
] as const

/** Asserts that the given value is a valid `StoragePool` permission. */
export const assertStoragePoolPermission = assert.stringEnum(...STORAGE_POOL_PERMISSIONS)

/** The permission that a user has on a storage pool. */
export type StoragePoolPermission = Asserted<typeof assertStoragePoolPermission>
