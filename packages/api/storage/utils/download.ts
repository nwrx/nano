import type { ModuleStorage } from '..'
import type { StorageFile } from '../entities'
import type { StorageDownloadOptions, StorageDownloadResult } from './createStoragePool'
import { getPool } from './getPool'

/**
 * Download a file from the storage and return the result. This function
 * will automatically find the storage pool by the file's pool ID and
 * download the file from the found storage pool.
 *
 * @param file The file to download.
 * @param options The options to use to download the file.
 * @returns The result of the download operation.
 */
export async function download(this: ModuleStorage, file: StorageFile, options?: StorageDownloadOptions): Promise<StorageDownloadResult> {
  const pool = await getPool.call(this, file.pool)
  return pool.download(file, options)
}
