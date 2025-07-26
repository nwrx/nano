import type { Loose } from '@unshared/types'
import type { ModuleMcpServer } from '../index'
import { createParser } from '@unshared/validation'
import { ModuleMcpPool } from '../../mcpPool'
import { assertMcpPool } from '../../mcpPool/utils/assertMcpPool'
import { assertWorkspace } from '../../workspace/utils/assertWorkspace'
import { assertMcpServer } from './assertMcpServer'
import { createMcpServerClient } from './createMcpServerClient'

const GET_MCP_SERVER_CLIENT_OPTIONS_SCHEMA = createParser({
  workspace: assertWorkspace,
  pool: assertMcpPool,
  server: assertMcpServer,
})

/** The options for getting an MCP server client. */
export type GetMcpServerClientOptions = Loose<ReturnType<typeof GET_MCP_SERVER_CLIENT_OPTIONS_SCHEMA>>

/**
 * Get an MCP server client for a given workspace, pool, and server.
 * This function will connect to the MCP server using the SSE transport.
 *
 * @param options The options for getting the MCP server client.
 * @returns The MCP server client instance.
 */
export async function getMcpServerClient(this: ModuleMcpServer, options: GetMcpServerClientOptions) {
  const modulePool = this.getModule(ModuleMcpPool)
  const { workspace, pool, server } = GET_MCP_SERVER_CLIENT_OPTIONS_SCHEMA(options)

  // --- If the client already exists, return it.
  const exists = this.mcpServerClients.get(server.id)
  if (exists) return exists

  // --- Get the manager and gateway for the MCP pool.
  const manager = await modulePool.getPoolManager({ workspace, pool })
  const gateway = await modulePool.getPoolGateway({ workspace, pool })

  // --- Create the MCP server client and watch logs.
  const client = createMcpServerClient.call(this, { manager, gateway, server })
  this.mcpServerClients.set(server.id, client)
  return client
}
