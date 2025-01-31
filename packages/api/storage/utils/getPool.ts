import type { ModuleStorage } from '../index'
import type { StoragePool } from './createStoragePool'

/**
 * Given an ID, return its `StoragePool` entity. If no ID is provided, default
 * to the 'default' pool. If the pool is not found, throw an error.
 *
 * @param id The ID of the storage pool to resolve.
 * @returns The `StoragePool` entity of the resolved storage pool.
 */
export async function getPool(this: ModuleStorage, id = 'default'): Promise<StoragePool> {
  const pool = this.storagePools.get(id)
  if (!pool) throw this.errors.STORAGE_POOL_NOT_FOUND(id)
  return await Promise.resolve(pool)
}
