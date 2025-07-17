import type { Loose } from '@unshared/types'
import type { ModuleMcpPool } from '../index'
import type { McpPoolPermission } from './assertMcpPoolPermission'
import { createParser } from '@unshared/validation'
import { assertMcpPool } from './assertMcpPool'

/** The parser function for the {@linkcode getMcpPoolProjectPermissions} function. */
const GET_MCP_POOL_PROJECT_PERMISSIONS_SCHEMA = createParser({
  pool: assertMcpPool,
})

/** The options to resolve the MCP pool project assignments with. */
export type GetMcpPoolProjectPermissionsOptions = Loose<ReturnType<typeof GET_MCP_POOL_PROJECT_PERMISSIONS_SCHEMA>>

/**
 * Get the list of projects that have access to the MCP pool and their permissions.
 *
 * @param options The options to find the MCP pool project assignments with.
 * @returns The project assignments within the MCP pool.
 * @example await getMcpPoolProjectPermissions({ pool }) // { 'project-1': ['Read'], ... }
 */
export async function getMcpPoolProjectPermissions(this: ModuleMcpPool, options: GetMcpPoolProjectPermissionsOptions): Promise<Record<string, McpPoolPermission[]>> {
  const { pool } = GET_MCP_POOL_PROJECT_PERMISSIONS_SCHEMA(options)

  // --- Get the MCP pool project assignments from the database.
  const { McpPoolProjectAssignment } = this.getRepositories()
  const assignments = await McpPoolProjectAssignment.find({
    where: { pool },
    relations: { project: true },
    select: { permission: true, project: { name: true } },
  })

  // --- Collect the assignments by project.
  const permissions = new Map<string, McpPoolPermission[]>()
  for (const { project, permission } of assignments) {
    if (!project) throw new Error('`project` relation not loaded for McpPoolProjectAssignment')
    const { name } = project
    if (!permissions.has(name)) permissions.set(name, [])
    permissions.get(name)!.push(permission)
  }

  // --- Return the assignments by project.
  return Object.fromEntries(permissions)
}
