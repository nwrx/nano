import type { ModuleStorage, StorageFile } from '..'
import type { FileLike, StorageUploadOptions } from '../adapters'

export interface UploadOptions extends StorageUploadOptions {

  /**
   * The ID of the storage pool to use to upload the file.
   *
   * @default 'Default'
   */
  pool?: string
}

/**
 * Upload a file to the storage and return the entity.
 *
 * @param file The file to upload.
 * @param options The options to use to upload the file.
 * @returns The `StorageFile` entity of the uploaded file.
 */
export async function upload(this: ModuleStorage, file: FileLike, options: UploadOptions = {}): Promise<StorageFile> {
  const { pool: poolId = 'Default', ...uploadOptions } = options

  // --- Find the storage pool by the ID.
  const pool = this.storagePools.find(pool => pool.name === poolId)
  if (!pool) throw new Error('The storage pool does not exist')

  // --- Upload the file to the storage pool and return the entity.
  const entity = await pool.upload(file, uploadOptions)
  entity.pool = poolId
  entity.size = file.size
  entity.type = file.type
  entity.name = file.name
  return entity
}
