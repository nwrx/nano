import type { StoragePoolAdapter } from '../adapters'
import type { ModuleStorage } from '../index'
import { getPoolAdapter } from './getPoolAdapter'
import { getPublicPool } from './getPublicPool'

/**
 * Get the public storage pool adapter. This function will automatically
 * find the public storage pool and return its adapter.
 *
 * @returns The public storage pool adapter.
 * @example
 *
 * // Get the public storage pool adapter.
 * const publicPoolAdapter = await getPublicPoolAdapter.call(storageModule)
 *
 * // Download a file from the public pool.
 * const file = await StorageFile.findOneBy({ id: 'some-file-id' })
 * const result = await publicPoolAdapter.download(file)
 */
export async function getPublicPoolAdapter(this: ModuleStorage): Promise<StoragePoolAdapter> {
  const pool = await getPublicPool.call(this)
  const adapter = await getPoolAdapter.call(this, pool)
  await adapter.initialize() // Ensure the adapter is initialized
  return adapter
}
