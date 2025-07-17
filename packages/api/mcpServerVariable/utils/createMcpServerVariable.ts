import type { Loose } from '@unshared/types'
import type { ModuleMcpServerVariable } from '../index'
import { assert, createParser } from '@unshared/validation'
import { assertMcpServer } from '../../mcpServer/utils/assertMcpServer'
import { assertUser } from '../../user'
import { assertVaultVariable } from '../../vault'

export const CREATE_MCP_SERVER_VARIABLE_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  server: assertMcpServer,
  name: assert.stringNotEmpty,
  value: [[assert.undefined], [assert.stringNotEmpty]],
  variable: [[assert.undefined], [assertVaultVariable]],
  mountAtPath: [[assert.undefined], [assert.stringNotEmpty]],
})

/** The options for creating an MCP server variable. */
export type CreateMcpServerVariableOptions = Loose<ReturnType<typeof CREATE_MCP_SERVER_VARIABLE_OPTIONS_SCHEMA>>

/**
 * Creates a new MCP server variable assignment that allows an MCP server to access a vault variable.
 * The variable can be exposed as an environment variable or mounted as a file in the server container.
 * The function will throw an error if the server already has access to the same variable.
 *
 * @param options The options for creating the MCP server variable.
 * @returns The newly created `McpServerVariable` entity.
 * @example
 *
 * // Assign a vault variable to an MCP server as an environment variable.
 * const serverVariable = await moduleMcp.createMcpServerVariable({
 *   user,
 *   server,
 *   vault,
 *   name: 'DATABASE_PASSWORD',
 *   name: 'DB_PASSWORD'
 * })
 *
 * // Assign a vault variable to an MCP server as a mounted file.
 * const serverVariable = await moduleMcp.createMcpServerVariable({
 *   user,
 *   server,
 *   vault,
 *   name: 'database-config',
 *   mountAtPath: '/app/config/database.conf'
 * })
 */
export async function createMcpServerVariable(this: ModuleMcpServerVariable, options: CreateMcpServerVariableOptions) {
  const { user, server, value, variable, name, mountAtPath } = CREATE_MCP_SERVER_VARIABLE_OPTIONS_SCHEMA(options)

  // --- Assert that either value or variable is provided, but not both.
  if ((value && variable) || (!value && !variable))
    throw this.errors.MCP_SERVER_VARIABLE_INVALID_SOURCE()

  // --- Assert that the server doesn't already have access to this variable.
  const { McpServerVariable } = this.getRepositories()
  const exists = await McpServerVariable.countBy({ server, name })
  if (exists > 0) throw this.errors.MCP_SERVER_VARIABLE_ALREADY_EXISTS(server.name, name)

  // --- Create the MCP server variable assignment.
  return McpServerVariable.create({
    name,
    server,
    value,
    variable,
    mountAtPath,
    createdBy: user,
  })
}
