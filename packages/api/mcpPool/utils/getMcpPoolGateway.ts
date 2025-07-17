import type { Loose } from '@unshared/types'
import type { ModuleMcpPool } from '..'
import type { McpGateway } from '../../mcpGateway'
import { createParser } from '@unshared/validation'
import { ModuleMcpGateway } from '../../mcpGateway'
import { assertWorkspace } from '../../workspace/utils/assertWorkspace'
import { assertMcpPool } from './assertMcpPool'
import { getMcpPoolManager } from './getMcpPoolManager'

export const GET_MCP_POOL_GATEWAY_OPTIONS_SCHEMA = createParser({
  workspace: assertWorkspace,
  pool: assertMcpPool,
})

/** The options for getting an MCP pool gateway. */
export type GetMcpPoolGatewayOptions = Loose<ReturnType<typeof GET_MCP_POOL_GATEWAY_OPTIONS_SCHEMA>>

/**
 * Get the MCP pool gateway for a given workspace and pool.
 * This function will return the gateway URL for the MCP pool.
 *
 * @param options The options for getting the MCP pool gateway.
 * @returns The MCP pool gateway URL.
 */
export async function getMcpPoolGateway(
  this: ModuleMcpPool,
  options: GetMcpPoolGatewayOptions,
): Promise<McpGateway> {
  const moduleGateway = this.getModule(ModuleMcpGateway)
  const { workspace, pool } = GET_MCP_POOL_GATEWAY_OPTIONS_SCHEMA(options)

  // --- Ensure the pool is loaded.
  const manager = await getMcpPoolManager.call(this, { workspace, pool })
  const { McpGateway } = moduleGateway.getRepositories()
  const gateway = await McpGateway.findOne({ where: { manager: { id: manager.id } } })
  if (!gateway) throw this.errors.MCP_POOL_NO_GATEWAY_ASSIGNED(workspace.name, pool.name, manager.identity)

  // --- Return the gateway URL.
  return gateway
}
