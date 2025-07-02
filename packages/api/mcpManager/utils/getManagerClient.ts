import type { McpManager } from '../entities'
import type { ModuleMcpManager } from '../index'
import type { McpManagerClient } from './createManagerClient'
import { createManagerClient } from './createManagerClient'

/**
 * Get the manager client given a `McpManager` entity.
 *
 * @param manager The `McpManager` entity to get the client for.
 * @returns The `McpManager` client associated with the given entity.
 * @example
 * const moduleMcpManager = this.getModule(ModuleMcpManager)
 * const manager = await moduleMcpManager.getManager({ identity: 'my-manager', user })
 * const client = moduleMcpManager.getManagerClient(manager)
 */
export function getManagerClient(this: ModuleMcpManager, manager: McpManager): McpManagerClient {
  const cached = this.managers.get(manager.id)
  if (cached) return cached

  // --- If the client does not exist, create a new one.
  // --- Additionally, append it to the managers map for future use.
  const client = createManagerClient(manager)
  this.managers.set(manager.id, client)
  return client
}
