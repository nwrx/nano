import type { ModuleStorage } from '../index'

/**
 * Initialize the storage pools by calling the `initialize` method on each
 * registered storage adapter on the `ModuleStorage` instance.
 */
export async function initialize(this: ModuleStorage): Promise<void> {
  for (const [,pool] of this.storagePools) await pool.initialize()
}
