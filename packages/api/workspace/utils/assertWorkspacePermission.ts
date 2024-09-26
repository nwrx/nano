import type { Asserted } from '@unshared/types'
import { createAssertStringEnum } from '@unshared/validation'

/**
 * Asserts that the given value is a valid `Workspace` permission.
 *
 * @param value The value to assert.
 * @example assertWorkspacePermission('Owner') // 'Owner'
 */
export const assertWorkspacePermission = createAssertStringEnum([
  'Owner',
  'Write',
  'Read',
])

/** The permission that a user has on a workspace. */
export type WorkspacePermission = Asserted<typeof assertWorkspacePermission>
