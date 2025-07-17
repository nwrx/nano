import type { Loose } from '@unshared/types'
import type { McpServerVariable, ModuleMcpServerVariable } from '../index'
import { assert, createParser } from '@unshared/validation'
import { assertMcpServer } from '../../mcpServer/utils/assertMcpServer'

export const GET_SERVER_VARIABLE_OPTIONS_SCHEMA = createParser({
  server: assertMcpServer,
  name: assert.stringNotEmpty,
})

/** The options for getting an MCP server variable. */
export type GetServerVariableOptions = Loose<ReturnType<typeof GET_SERVER_VARIABLE_OPTIONS_SCHEMA>>

/**
 * Gets an MCP server variable by its name.
 *
 * @param options The options for getting the MCP server variable.
 * @returns The `McpServerVariable` entity.
 * @throws If the variable is not found.
 */
export async function getServerVariable(
  this: ModuleMcpServerVariable,
  options: GetServerVariableOptions,
): Promise<McpServerVariable> {
  const { server, name } = GET_SERVER_VARIABLE_OPTIONS_SCHEMA(options)

  // --- Get the variable by server and name.
  const { McpServerVariable } = this.getRepositories()
  const variable = await McpServerVariable.findOneBy({ server, name })
  if (!variable) throw this.errors.MCP_SERVER_VARIABLE_NOT_FOUND(server.name, name)

  // --- Return the found variable.
  return variable
}
