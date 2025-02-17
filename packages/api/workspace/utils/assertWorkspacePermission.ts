import type { Asserted } from '@unshared/types'
import { assert } from '@unshared/validation'

/** A list of all possible workspace permissions. */
export const WORKSPACE_PERMISSIONS = [
  'Owner',
  'Write',
  'Read',
] as const

/** Asserts that the given value is a valid `Workspace` permission. */
export const assertWorkspacePermission = assert.stringEnum(...WORKSPACE_PERMISSIONS)

/** The permission that a user has on a workspace. */
export type WorkspacePermission = Asserted<typeof assertWorkspacePermission>
