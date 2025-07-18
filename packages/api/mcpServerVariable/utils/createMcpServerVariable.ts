import type { Loose } from '@unshared/types'
import type { ModuleMcpServerVariable } from '../index'
import { assert, createParser } from '@unshared/validation'
import { assertMcpServer } from '../../mcpServer/utils/assertMcpServer'
import { assertUser } from '../../user'
import { ModuleVault } from '../../vault'
import { assertWorkspace } from '../../workspace'

export const CREATE_MCP_SERVER_VARIABLE_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  server: assertMcpServer,
  workspace: assertWorkspace,
  name: assert.stringNotEmpty,
  value: [[assert.undefined], [assert.stringNotEmpty]],
  variable: [[assert.undefined], [assert.stringNotEmpty]],
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
  const { user, server, workspace, name, value, variable, mountAtPath } = CREATE_MCP_SERVER_VARIABLE_OPTIONS_SCHEMA(options)

  // --- Assert that either value or variable is provided, but not both.
  if ((value && variable) || (!value && !variable))
    throw this.errors.MCP_SERVER_VARIABLE_INVALID_SOURCE()

  // --- Assert that the variable name is not taken.
  const { McpServerVariable } = this.getRepositories()
  const exists = await McpServerVariable.countBy({ server, name })
  if (exists > 0) throw this.errors.MCP_SERVER_VARIABLE_ALREADY_EXISTS(server.name, name)

  // --- Create the MCP server variable
  if (value) {
    return McpServerVariable.create({ name, server, value, mountAtPath, createdBy: user })
  }

  // --- If a vault variable is provided, we need to fetch it.
  else if (variable) {
    const [vaultName, variableName] = variable.split('/')
    const moduleVault = this.getModule(ModuleVault)
    const vault = await moduleVault.getVault({ user, workspace, name: vaultName, permission: 'Read' })
    const vaultVariable = await moduleVault.getVariable({ workspace, vault, name: variableName })
    return McpServerVariable.create({ name, server, variable: vaultVariable, mountAtPath, createdBy: user })
  }

  // --- If neither value nor variable is provided, throw an error.
  throw this.errors.MCP_SERVER_VARIABLE_INVALID_SOURCE()
}
