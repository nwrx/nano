import type { Loose } from '@unshared/types'
import type { ModuleMcpServerArgument } from '../index'
import { assert, createParser } from '@unshared/validation'
import { assertMcpServer } from '../../mcpServer/utils/assertMcpServer'

const GET_ARGUMENT_OPTIONS_SCHEMA = createParser({
  server: assertMcpServer,
  position: assert.number,
})

/** The options for getting an MCP server argument. */
type GetArgumentOptions = Loose<ReturnType<typeof GET_ARGUMENT_OPTIONS_SCHEMA>>

/**
 * Gets an MCP server argument by its position.
 *
 * @param options The options for getting the MCP server argument.
 * @returns The `McpServerArgument` entity.
 * @throws If the argument is not found.
 */
export async function getArgument(this: ModuleMcpServerArgument, options: GetArgumentOptions) {
  const { server, position } = GET_ARGUMENT_OPTIONS_SCHEMA(options)

  // --- Get the argument by server and position.
  const { McpServerArgument } = this.getRepositories()
  const argument = await McpServerArgument.findOneBy({ server, position })
  if (!argument) throw this.errors.MCP_SERVER_ARGUMENT_NOT_FOUND(server.name, position)

  // --- Return the found argument.
  return argument
}
