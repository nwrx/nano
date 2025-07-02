import type { ModuleMcpGateway } from '..'
import type { McpGateway } from '../entities'
import { createGatewayClient, type McpGatewayClient } from './createGatewayClient'

/**
 * Get the MCP gateway client for the given gateway. If the client does not exist,
 * it will be created and stored in the gateways map for future use.
 *
 * @param gateway The MCP gateway to get the client for.
 * @returns The MCP gateway client for the given gateway.
 */
export function getGatewayClient(this: ModuleMcpGateway, gateway: McpGateway): McpGatewayClient {
  const existingClient = this.gateways.get(gateway.identity)
  if (existingClient) return existingClient

  // --- If the client does not exist, create a new one.
  // --- Additionally, append it to the gateways map for future use.
  const client = createGatewayClient(gateway)
  this.gateways.set(gateway.identity, client)
  return client
}
