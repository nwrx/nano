import type { Asserted } from '@unshared/types'
import { assert } from '@unshared/validation'

export const STORAGE_FILE_PERMISSIONS = [
  'Owner',
  'Write',
  'Read',
] as const

/** Asserts that the given value is a valid `StorageFile` permission. */
export const assertStorageFilePermission = assert.stringEnum(...STORAGE_FILE_PERMISSIONS)

/** The permission that a user has on a storage file. */
export type StorageFilePermission = Asserted<typeof assertStorageFilePermission>
