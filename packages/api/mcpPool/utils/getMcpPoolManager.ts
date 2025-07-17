import type { Loose } from '@unshared/types'
import type { McpManager } from '../../mcpManager'
import type { ModuleMcpPool } from '../index'
import { createParser } from '@unshared/validation'
import { ModuleMcpManager } from '../../mcpManager'
import { assertWorkspace } from '../../workspace/utils/assertWorkspace'
import { assertMcpPool } from './assertMcpPool'

export const GET_MCP_POOL_MANAGER_OPTIONS_SCHEMA = createParser({
  workspace: assertWorkspace,
  pool: assertMcpPool,
})

/** The options for getting an MCP pool manager. */
export type GetMcpPoolManagerOptions = Loose<ReturnType<typeof GET_MCP_POOL_MANAGER_OPTIONS_SCHEMA>>

/**
 * Get or assign an `McpPool` to an existing MCP manager. If the pool already has a manager assigned,
 * it will return the existing manager. Otherwise, it will elect the first available manager
 *
 * @param options The options for getting the MCP pool manager.
 * @returns The MCP pool manager entity.
 */
export async function getMcpPoolManager(
  this: ModuleMcpPool,
  options: GetMcpPoolManagerOptions,
): Promise<McpManager> {
  const moduleManager = this.getModule(ModuleMcpManager)
  const { workspace, pool } = GET_MCP_POOL_MANAGER_OPTIONS_SCHEMA(options)

  // --- Ensure the pool is loaded. Return early if the pool already has a manager.
  if (pool.manager === undefined) throw this.errors.MCP_POOL_MANAGER_RELATION_NOT_LOADED(workspace.name, pool.name)
  if (pool.manager !== null) return pool.manager

  // --- Get the first available MCP manager.
  const { McpPool } = this.getRepositories()
  const manager = await moduleManager.requestManager()
  await McpPool.update({ id: pool.id }, { manager })
  return manager
}
