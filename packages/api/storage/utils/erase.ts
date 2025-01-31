import type { ModuleStorage } from '..'
import type { StorageFile } from '../entities'
import type { StorageEraseOptions } from './createStoragePool'
import { getPool } from './getPool'

/**
 * Erase a file from the storage. This function will automatically find
 * the storage pool by the file's pool ID and erase the file from the
 * found storage pool. This function will also soft-remove the `StorageFile`
 * entity from the database.
 *
 * @param file The file to erase.
 * @param options The options to use to erase the file.
 */
export async function erase(this: ModuleStorage, file: StorageFile, options?: StorageEraseOptions): Promise<void> {
  const pool = await getPool.call(this, file.pool)
  await pool.erase(file, options)
  const { StorageFile } = this.getRepositories()
  await StorageFile.softRemove(file, options)
}
