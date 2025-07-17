import type { Asserted } from '@unshared/types'
import { assert } from '@unshared/validation'

/** A list of all possible MCP pool permissions. */
export const MCP_POOL_PERMISSIONS = [
  'Owner',
  'Write',
  'Read',
] as const

/** Asserts that the given value is a valid `McpPool` permission. */
export const assertMcpPoolPermission = assert.stringEnum(...MCP_POOL_PERMISSIONS)

/** The permission that a user has on an MCP pool. */
export type McpPoolPermission = Asserted<typeof assertMcpPoolPermission>
