import type { Loose } from '@unshared/types'
import type { McpServer } from '../entities'
import type { ModuleMcpServer } from '../index'
import { assert, createParser } from '@unshared/validation'
import { assertMcpPool } from '../../mcpPool/utils/assertMcpPool'
import { assertUser } from '../../user/utils/assertUser'

export const CREATE_MCP_SERVER_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  pool: assertMcpPool,
  name: assert.stringNotEmpty,
})

/** The options for creating an MCP server. */
export type CreateMcpServerOptions = Loose<ReturnType<typeof CREATE_MCP_SERVER_OPTIONS_SCHEMA>>

/**
 * Creates a new MCP server within the specified pool. The function will create a new
 * `McpServer` entity with the given configuration and assign the user as the creator.
 * The function will throw an error if a server with the same name already exists in the pool.
 *
 * @param options The options for creating the MCP server.
 * @returns The newly created `McpServer` entity.
 * @example
 *
 * // Create an MCP server.
 * const server = await moduleMcp.createMcpServer({
 *   user,
 *   pool,
 *   name: 'weather-service',
 * })
 */
export async function createMcpServer(this: ModuleMcpServer, options: CreateMcpServerOptions): Promise<McpServer> {
  const { user, pool, name } = CREATE_MCP_SERVER_OPTIONS_SCHEMA(options)

  // --- Assert that no server with the same name exists in the pool.
  const { McpServer } = this.getRepositories()
  const exists = await McpServer.countBy({ name, pool })
  if (exists > 0) throw this.errors.MCP_SERVER_ALREADY_EXISTS(pool.name, name)

  // --- Create the MCP server.
  const server = McpServer.create({ name, title: name, pool, createdBy: user })
  return await McpServer.save(server)
}
