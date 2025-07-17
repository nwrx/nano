import type { Loose } from '@unshared/types'
import type { ModuleMcpServer } from '../index'
import { toSlug } from '@unshared/string'
import { assert, createParser } from '@unshared/validation'
import { assertMcpPool } from '../../mcpPool/utils/assertMcpPool'
import { assertUser } from '../../user/utils/assertUser'
import { assertWorkspace } from '../../workspace/utils/assertWorkspace'
import { assertMcpServer } from './assertMcpServer'

const RENAME_MCP_SERVER_OPTIONS = createParser({
  user: assertUser,
  pool: assertMcpPool,
  server: assertMcpServer,
  workspace: assertWorkspace,
  name: [assert.stringNotEmpty, toSlug],
})

/** The options for renaming an MCP server. */
export type RenameMcpServerOptions = Loose<ReturnType<typeof RENAME_MCP_SERVER_OPTIONS>>

/**
 * Rename an MCP server. This function will check if the new name is available
 * in the pool and update the server's name.
 *
 * @param options The options to rename the server with.
 * @returns The server entity with updated name.
 */
export async function renameMcpServer(this: ModuleMcpServer, options: RenameMcpServerOptions): Promise<void> {
  const { user, workspace, pool, server, name } = RENAME_MCP_SERVER_OPTIONS(options)

  // --- Check if the new name is already taken
  const { McpServer } = this.getRepositories()
  const exists = await McpServer.countBy({ name, pool: { id: pool.id } })
  if (exists > 0) throw this.errors.MCP_SERVER_NAME_TAKEN(workspace.name, pool.name, name)

  // --- Update the server name
  await McpServer.update({ id: server.id }, { name, updatedBy: user })
}
