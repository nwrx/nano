import type { Asserted } from '@unshared/types'
import { assert } from '@unshared/validation'

/** A list of all possible flow permissions. */
export const FLOW_PERMISSIONS = [
  'Owner',
  'Write',
  'Read',
] as const

/** Asserts that the given value is a valid `Flow` permission. */
export const assertFlowPermission = assert.stringEnum(...FLOW_PERMISSIONS)

/** The permission that a user has on a flow. */
export type FlowPermission = Asserted<typeof assertFlowPermission>
