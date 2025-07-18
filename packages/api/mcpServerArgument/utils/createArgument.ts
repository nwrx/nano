import type { Loose } from '@unshared/types'
import type { McpServerArgument } from '../entities'
import type { ModuleMcpServerArgument } from '../index'
import { assert, createParser } from '@unshared/validation'
import { assertMcpServer } from '../../mcpServer/utils/assertMcpServer'
import { assertUser } from '../../user'
import { ModuleVault } from '../../vault'
import { assertWorkspace } from '../../workspace'

export const CREATE_MCP_SERVER_ARGUMENT_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  server: assertMcpServer,
  workspace: assertWorkspace,
  value: [[assert.undefined], [assert.stringNotEmpty]],
  variable: [[assert.undefined], [assert.stringNotEmpty]],
})

/** The options for creating an MCP server argument. */
export type CreateMcpServerArgumentOptions = Loose<ReturnType<typeof CREATE_MCP_SERVER_ARGUMENT_OPTIONS_SCHEMA>>

/**
 * Creates a new MCP server argument that allows an MCP server to receive command line arguments.
 * The argument can be a direct value or sourced from a vault variable for sensitive data.
 * The function will throw an error if the server already has an argument at the specified position.
 *
 * @param options The options for creating the MCP server argument.
 * @returns The newly created `McpServerArgument` entity.
 * @example
 *
 * // Create a direct value argument at position 0.
 * const serverArgument = await moduleMcp.createMcpServerArgument({
 *   user,
 *   server,
 *   workspace,
 *   value: '--verbose'
 * })
 *
 * // Create an argument sourced from a vault variable at position 1.
 * const serverArgument = await moduleMcp.createMcpServerArgument({
 *   user,
 *   server,
 *   workspace,
 *   variable: 'my-vault/my-variable',
 * })
 */
export async function createArgument(
  this: ModuleMcpServerArgument,
  options: CreateMcpServerArgumentOptions,
): Promise<McpServerArgument> {
  const { user, server, workspace, value, variable } = CREATE_MCP_SERVER_ARGUMENT_OPTIONS_SCHEMA(options)

  // --- Assert that either value or variable is provided, but not both.
  if ((value && variable) || (!value && !variable))
    throw this.errors.MCP_SERVER_ARGUMENT_INVALID_SOURCE()

  // --- Get the position for the new argument.
  const { McpServerArgument } = this.getRepositories()
  const position = await McpServerArgument.countBy({ server })

  // --- Create the MCP server argument
  if (value) {
    return McpServerArgument.create({ position, server, value, createdBy: user })
  }

  // --- If a vault variable is provided, we need to fetch it.
  else if (variable) {
    const [vaultName, variableName] = variable.split('/')
    const moduleVault = this.getModule(ModuleVault)
    const vault = await moduleVault.getVault({ user, workspace, name: vaultName, permission: 'Read' })
    const vaultVariable = await moduleVault.getVariable({ workspace, vault, name: variableName })
    return McpServerArgument.create({ position, server, value, variable: vaultVariable, createdBy: user })
  }

  // --- If neither value nor variable is provided, throw an error.
  throw this.errors.MCP_SERVER_ARGUMENT_INVALID_SOURCE()
}
