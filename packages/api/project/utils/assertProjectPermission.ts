import type { Asserted } from '@unshared/types'
import { assert } from '@unshared/validation'

export const PROJECT_PERMISSIONS = [
  'Owner',
  'Write',
  'VaultWrite',
  'VaultRead',
  'Execute',
  'Read',
] as const

/** Asserts that the given value is a valid `Project` permission. */
export const assertProjectPermission = assert.stringEnum(...PROJECT_PERMISSIONS)

/** The permission that a user has on a project. */
export type ProjectPermission = Asserted<typeof assertProjectPermission>
