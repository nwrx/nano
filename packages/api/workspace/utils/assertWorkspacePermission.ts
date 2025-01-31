import type { Asserted } from '@unshared/types'
import { assert } from '@unshared/validation'

/**
 * Asserts that the given value is a valid `Workspace` permission.
 *
 * @param value The value to assert.
 * @example assertWorkspacePermission('Owner') // 'Owner'
 */
export const assertWorkspacePermission = assert.stringEnum(
  'Owner',
  'Write',
  'Read',
).with('Invalid workspace permission')

/** The permission that a user has on a workspace. */
export type WorkspacePermission = Asserted<typeof assertWorkspacePermission>
