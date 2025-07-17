import type { Loose } from '@unshared/types'
import type { ModuleMcpPool } from '..'
import type { McpPool } from '../entities'
import { assert, createParser } from '@unshared/validation'
import { In } from 'typeorm'
import { assertUser } from '../../user/utils/assertUser'
import { assertWorkspace } from '../../workspace/utils/assertWorkspace'
import { assertMcpPoolPermission } from './assertMcpPoolPermission'

/** The schema for the getMcpPool options. */
const GET_MCP_POOL_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  workspace: assertWorkspace,
  name: assert.stringNotEmpty,
  permission: assertMcpPoolPermission,
  withDeleted: [[assert.undefined], [assert.boolean]],
  withManager: [[assert.undefined], [assert.boolean]],
  withServers: [[assert.undefined], [assert.boolean]],
  withAssignments: [[assert.undefined], [assert.boolean]],
  withProjectAssignments: [[assert.undefined], [assert.boolean]],
})

/** The options to get an MCP pool by name. */
export type GetMcpPoolOptions = Loose<ReturnType<typeof GET_MCP_POOL_OPTIONS_SCHEMA>>

/**
 * Get an MCP pool by name. The pool configuration will only be included if the user
 * has the required permissions to access the pool.
 *
 * @param options The options for getting the MCP pool
 * @returns The MCP pool
 */
export async function getMcpPool(this: ModuleMcpPool, options: GetMcpPoolOptions): Promise<McpPool> {
  const {
    user,
    workspace,
    name,
    permission,
    withDeleted,
    withServers,
    withManager,
    withAssignments,
    withProjectAssignments,
  } = GET_MCP_POOL_OPTIONS_SCHEMA(options)

  // --- Get the MCP pool entity.
  const { McpPool } = this.getRepositories()
  const pool = await McpPool.findOne({
    where: {
      name,
      workspace,
      assignments: { user, permission: In(['Owner', 'Read']) },
    },
    relations: {
      servers: withServers,
      manager: withManager,
      assignments: withAssignments ? { user: true } : false,
      projectAssignments: withProjectAssignments ? { project: true } : false,
    },
    withDeleted,
  })

  // --- Return early if the user has read access.
  if (!pool) throw this.errors.MCP_POOL_NOT_FOUND(workspace.name, name)
  if (permission === 'Read') return pool

  // --- Assert that the user has an assignment that matches the permission.
  const { McpPoolAssignment } = this.getRepositories()
  const isAllowed = await McpPoolAssignment.countBy({ user, pool, permission: In(['Owner', permission]) })
  if (!isAllowed) throw this.errors.MCP_POOL_FORBIDDEN(workspace.name, name)
  return pool
}
