import type { Readable } from 'node:stream'
import type { StorageFile } from '../entities'
import type { FileLike } from '../utils'

export interface StorageDownloadOptions {
  offset?: number
  size?: number
  abortSignal?: AbortSignal
}

export interface StorageDownloadResult {
  getUrl?: () => Promise<string>
  getText: () => Promise<string>
  getData: () => Promise<Buffer>
  getBase64Url: () => Promise<string>
  getStream: () => Promise<Readable>
  getContentLength: () => Promise<number>
  getContentType: () => Promise<string>
}

export interface StorageEraseOptions {
  abortSignal?: AbortSignal
}

export interface StorageUploadOptions {
  abortSignal?: AbortSignal
}

export interface StoragePurgeResult {
  size: number
  count: number
}

export interface StoragePoolAdapter {

  /**
   * Purges all the files from the storage that are not referenced by
   * any entity in the database.
   */
  initialize(): Promise<void>

  /**
   * Uploads a file to the storage.
   *
   * @param file The file to upload.
   */
  upload(file: FileLike, options?: StorageUploadOptions): Promise<StorageFile>

  /**
   * Downloads a file from the storage.
   *
   * @param file The file to download.
   * @param options The options to use to download the file.
   */
  download(file: StorageFile, options?: StorageDownloadOptions): StorageDownloadResult

  /**
   * Deletes a file from the storage.
   *
   * @param file The file to delete.
   * @param options The options to use to delete the file.
   */
  erase(file: StorageFile, options?: StorageEraseOptions): Promise<void>
}

/**
 * Creates a new storage pool with the specified options.
 *
 * @param options The options to use to create the storage pool.
 * @returns The created storage pool.
 */
export function createStoragePoolAdapter(options: StoragePoolAdapter): StoragePoolAdapter {
  return options
}
