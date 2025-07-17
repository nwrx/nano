import type { Loose } from '@unshared/types'
import type { ModuleMcpPool } from '../index'
import type { McpPoolPermission } from './assertMcpPoolPermission'
import { createParser } from '@unshared/validation'
import { assertMcpPool } from './assertMcpPool'

/** The parser function for the {@linkcode getMcpPoolPermissions} function. */
const GET_MCP_POOL_PERMISSIONS_SCHEMA = createParser({
  pool: assertMcpPool,
})

/** The options to resolve the MCP pool assignments with. */
export type GetMcpPoolPermissionsOptions = Loose<ReturnType<typeof GET_MCP_POOL_PERMISSIONS_SCHEMA>>

/**
 * Get the list of users that have access to the MCP pool and their permissions.
 *
 * @param options The options to find the MCP pool assignments with.
 * @returns The user assignments within the MCP pool.
 * @example await getMcpPoolPermissions({ pool }) // { user1: ['Owner'], ... }
 */
export async function getMcpPoolPermissions(
  this: ModuleMcpPool,
  options: GetMcpPoolPermissionsOptions,
): Promise<Record<string, McpPoolPermission[]>> {
  const { pool } = GET_MCP_POOL_PERMISSIONS_SCHEMA(options)

  // --- Get the MCP pool assignments from the database.
  const { McpPoolAssignment } = this.getRepositories()
  const assignments = await McpPoolAssignment.find({
    where: { pool },
    relations: { user: true },
    select: { permission: true, user: { username: true } },
  })

  // --- Collect the assignments by user.
  const permissions: Record<string, McpPoolPermission[]> = {}
  for (const { user, permission } of assignments) {
    if (!user) throw new Error('`user` relation not loaded for McpPoolAssignment')
    const { username } = user
    if (!permissions[username]) permissions[username] = []
    permissions[username].push(permission)
  }

  // --- Return the assignments by user.
  return permissions
}
