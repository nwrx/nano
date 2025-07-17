import type { McpPool } from '../entities'
import type { ModuleMcpPool } from '../index'
import { toSlug } from '@unshared/string'
import { assert, createParser } from '@unshared/validation'
import { assertWorkspace } from '../../workspace'
import { assertMcpPool } from './assertMcpPool'

const SET_PROJECT_NAME_OPTIONS = createParser({
  workspace: assertWorkspace,
  pool: assertMcpPool,
  name: [assert.stringNotEmpty, toSlug],
})

export type SetProjectNameOptions = Parameters<typeof SET_PROJECT_NAME_OPTIONS>[0]

/**
 * Set the name of a pool. This function will check if the new name is available
 * in the workspace and update the pool's name.
 *
 * @param options The options to set the pool name with.
 * @returns The pool entity with updated name.
 */
export async function renameMcpPool(this: ModuleMcpPool, options: SetProjectNameOptions): Promise<McpPool> {
  const { pool, name, workspace } = SET_PROJECT_NAME_OPTIONS(options)

  // --- Check if the new name is already taken
  const { McpPool } = this.getRepositories()
  const exists = await McpPool.countBy({ name, workspace })
  if (exists > 0) throw this.errors.MCP_POOL_NAME_TAKEN(workspace.name, name)

  // --- Update the pool name
  pool.name = name
  return await McpPool.save(pool)
}
