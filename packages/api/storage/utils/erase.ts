import type { ModuleStorage, StorageEraseOptions } from '..'
import type { StorageFile } from '../entities'

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

  // --- Find the storage pool by the ID.
  const pool = this.storagePools.find(pool => pool.name === file.pool)
  if (!pool) throw new Error('The storage pool of the file does not exist')

  // --- Erase the file from the storage pool and soft-remove the entity.
  await pool.erase(file, options)

  // --- Soft-remove the entity from the database.
  const { StorageFile } = this.getRepositories()
  await StorageFile.softRemove(file, options)
}
