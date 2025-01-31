import type { StorageFile } from '../entities'
import type { ModuleStorage } from '../index'
import type { FileLike } from './fileToStream'
import { getPool } from './getPool'

/**
 * Upload a file to the storage and return the entity.
 *
 * @param file The file to upload.
 * @returns The `StorageFile` entity of the uploaded file.
 */
export async function upload(this: ModuleStorage, file: FileLike): Promise<StorageFile> {
  const pool = await getPool.call(this, file.pool)
  const { StorageFile } = this.getRepositories()
  const entity = await pool.upload(file)
  return StorageFile.save(entity)
}
