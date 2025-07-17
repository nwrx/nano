import type { McpError } from '@modelcontextprotocol/sdk/types.js'
import type { Loose } from '@unshared/types'
import type { ModuleMcpServer } from '../index'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js'
import { createParser } from '@unshared/validation'
import packageJson from '../../../../package.json' assert { type: 'json' }
import { ModuleMcpPool } from '../../mcpPool'
import { assertMcpPool } from '../../mcpPool/utils/assertMcpPool'
import { assertWorkspace } from '../../workspace/utils/assertWorkspace'
import { assertMcpServer } from './assertMcpServer'

const GET_MCP_SERVER_CLIENT_OPTIONS_SCHEMA = createParser({
  pool: assertMcpPool,
  server: assertMcpServer,
  workspace: assertWorkspace,
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

  // --- Instantiate the MCP transport.
  const gateway = await modulePool.getPoolGateway({ workspace, pool })
  const baseUrl = /^https?:\/\//.test(gateway.address) ? gateway.address : `http://${gateway.address}`
  const url = new URL(`/${server.id}/sse`, baseUrl)
  const transport = new SSEClientTransport(url)

  // --- Connect to the MCP client and list tools.
  try {
    const client = new Client({ name: 'nano', version: packageJson.version })
    await client.connect(transport)
    return client
  }
  catch (error) {
    throw this.errors.MCP_SERVER_CONNECTION_FAILED(error as McpError)
  }
}
