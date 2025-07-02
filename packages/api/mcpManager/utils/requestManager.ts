import type { McpManager, ModuleMcpManager } from '..'
import { IsNull } from 'typeorm'
import { ModuleMcpGateway } from '../../mcpGateway'
import { getManagerClient } from './getManagerClient'

/**
 * Query the database and find the first MCP manager that is enabled,
 * has an associated gateway and both the gateway and the manager are reachable.
 *
 * @returns The first MCP manager that matches the criteria.
 */
export async function requestManager(this: ModuleMcpManager): Promise<McpManager> {
  const moduleMcpGateway = this.getModule(ModuleMcpGateway)
  const { McpManager } = this.getRepositories()

  // --- Get all McpManagers.
  const managers = await McpManager.find({
    where: {
      deletedAt: IsNull(),
      gateways: { deletedAt: IsNull() },
    },
    relations: { gateways: true },
    order: { createdAt: 'DESC' },
  })

  // --- Return the first manager that has a reachable gateway.
  for (const manager of managers) {
    if (!manager.gateways) continue
    if (manager.gateways.length === 0) continue
    try {
      const managerClient = getManagerClient.call(this, manager)
      await managerClient.getStatus()
      for (const gateway of manager.gateways) {
        const gatewayClient = moduleMcpGateway.getGatewayClient(gateway)
        await gatewayClient.getStatus()
        return manager
      }
    }
    catch { /* ignore */ }
  }

  // --- If no manager is found, throw an error.
  throw this.errors.MCP_MANAGER_NO_ELIGIBLE_MANAGER()
}
