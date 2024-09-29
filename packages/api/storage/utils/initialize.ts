import type { ModuleStorage } from '../index'

/**
 * Initialize the storage pools.
 */
export async function initialize(this: ModuleStorage): Promise<void> {
  for (const adapter of this.storagePools) await adapter.initialize()
}
