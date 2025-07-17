import type { Loose } from '@unshared/types'
import type { McpPool } from '../entities'
import type { ModuleMcpPool } from '../index'
import { assert, createParser } from '@unshared/validation'
import { ModuleMcpManager } from '../../mcpManager'
import { assertMcpManager } from '../../mcpManager/utils/assertMcpManager'
import { assertUser } from '../../user/utils/assertUser'
import { assertWorkspace } from '../../workspace/utils/assertWorkspace'

export const CREATE_MCP_POOL_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  workspace: assertWorkspace,
  manager: [[assert.undefined], [assertMcpManager]],
  name: [[assert.undefined], [assert.stringNotEmpty]],
})

/** The options for creating an MCP pool. */
export type CreateMcpPoolOptions = Loose<ReturnType<typeof CREATE_MCP_POOL_OPTIONS_SCHEMA>>

/**
 * Creates a new MCP pool for managing MCP servers within a workspace. The function will create a new
 * `McpPool` entity with the given options and assign the user as the creator. The function will
 * throw an error if a pool with the same name already exists in the workspace.
 *
 * @param options The options for creating the MCP pool.
 * @returns The newly created `McpPool` entity.
 * @example
 *
 * // Create an MCP pool.
 * const pool = await moduleMcp.createMcpPool({
 *   user,
 *   workspace,
 *   manager,
 *   name: 'production-pool',
 * })
 */
export async function createMcpPool(this: ModuleMcpPool, options: CreateMcpPoolOptions): Promise<McpPool> {
  const {
    user,
    workspace,
    manager,
    name = 'default',
  } = CREATE_MCP_POOL_OPTIONS_SCHEMA(options)

  // --- Assert that no pool with the same name exists in the workspace.
  const { McpPool } = this.getRepositories()
  const exists = await McpPool.countBy({ name, workspace })
  if (exists > 0) throw this.errors.MCP_POOL_ALREADY_EXISTS(workspace.name, name)

  // --- Create the Pool in the database.
  const { McpPoolAssignment } = this.getRepositories()
  const assignment = McpPoolAssignment.create({ user, createdBy: user, permission: 'Owner' })
  const pool = McpPool.create({
    manager,
    workspace,
    name,
    assignments: [assignment],
    createdBy: user,
  })
  await McpPool.save(pool)

  // --- Create the Pool with the Kubernetes MCP manager if provided.
  if (manager) {
    const moduleManager = this.getModule(ModuleMcpManager)
    const client = moduleManager.getManagerClient(manager)
    await client.createPool({
      name: pool.id,
      defaultIdleTimeout: 2 * 60, // Default idle timeout of 2 minutes.
      maxServersLimit: 100, // Default max servers limit of 10.
      maxServersActive: 5, // Default max active servers of 5.
      defaultResources: {
        limits: {
          cpu: '1000m', // Default CPU limit of 1000m (1 CPU).
          memory: '512Mi', // Default memory limit of 512Mi.
        },
      },
    })
  }

  return pool
}
