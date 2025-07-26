import type { Loose } from '@unshared/types'
import type { ModuleMcpServer } from '..'
import type { McpServer } from '../entities'
import { assert, createParser } from '@unshared/validation'
import { assertMcpPool } from '../../mcpPool/utils/assertMcpPool'
import { assertWorkspace } from '../../workspace/utils/assertWorkspace'

const GET_MCP_SERVER_OPTIONS_SCHEMA = createParser({
  workspace: assertWorkspace,
  pool: assertMcpPool,
  name: assert.stringNotEmpty,
  withWorkspace: [[assert.undefined], [assert.boolean]],
  withPool: [[assert.undefined], [assert.boolean]],
  withCreatedBy: [[assert.undefined], [assert.boolean]],
  withUpdatedBy: [[assert.undefined], [assert.boolean]],
  withArguments: [[assert.undefined], [assert.boolean]],
  withVariables: [[assert.undefined], [assert.boolean]],
  withDeleted: [[assert.undefined], [assert.boolean]],
})

/** The options for getting an MCP server. */
export type GetMcpServerOptions = Loose<ReturnType<typeof GET_MCP_SERVER_OPTIONS_SCHEMA>>

/**
 * Get an `McpServer` entity by its pool and name.
 *
 * @param options The options for getting the MCP server
 * @returns The MCP server entity
 */
export async function getMcpServer(this: ModuleMcpServer, options: GetMcpServerOptions): Promise<McpServer> {
  const {
    workspace,
    pool,
    name,
    withWorkspace = false,
    withPool = false,
    withCreatedBy = false,
    withUpdatedBy = false,
    withArguments = false,
    withVariables = false,
    withDeleted = false,
  } = GET_MCP_SERVER_OPTIONS_SCHEMA(options)

  // --- Get the MCP pool entity.
  const { McpServer } = this.getRepositories()
  const server = await McpServer.findOne({
    where: {
      name,
      pool: { id: pool.id },
    },
    withDeleted,
    relations: {
      pool: withPool ? { workspace: withWorkspace } : undefined,
      createdBy: withCreatedBy,
      updatedBy: withUpdatedBy,
      arguments: withArguments,
      variables: withVariables,
      deletedBy: withDeleted,
    },
  })

  // --- Return early if the server is not found.
  if (!server) throw this.errors.MCP_SERVER_NOT_FOUND(workspace.name, pool.name, name)
  return server
}
