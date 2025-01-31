import type { ModuleStorage } from '..'
import type { StorageDownloadOptions, StorageDownloadResult } from '../adapters'
import type { StorageFile } from '../entities'

/**
 * Download a file from the storage and return the result. This function
 * will automatically find the storage pool by the file's pool ID and
 * download the file from the found storage pool.
 *
 * @param file The file to download.
 * @param options The options to use to download the file.
 * @returns The result of the download operation.
 */
export function download(this: ModuleStorage, file: StorageFile, options?: StorageDownloadOptions): StorageDownloadResult {

  // --- Find the storage pool by the ID.
  const pool = this.storagePools.find(pool => pool.name === file.pool)
  if (!pool) throw new Error('The storage pool of the file does not exist')

  // --- Download the file from the storage pool and return the result.
  return pool.download(file, options)
}
