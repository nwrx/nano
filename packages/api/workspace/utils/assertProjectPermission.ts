import type { Asserted } from '@unshared/types'
import { assert } from '@unshared/validation'

/**
 * Asserts that the given value is a valid `WorkspaceProject` permission.
 *
 * @param value The value to assert.
 * @example assertProjectPermission('Owner') // 'Owner'
 */
export const assertProjectPermission = assert.stringEnum(
  'Owner',
  'Write',
  'WriteApiKeys',
  'WriteSecrets',
  'WriteVariables',
  'Execute',
  'Read',
).with('Invalid project permission')

/** The permission that a user has on a project. */
export type WorkspaceProjectPermission = Asserted<typeof assertProjectPermission>
