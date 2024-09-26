/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Readable } from 'node:stream'
import type { RemoveOptions } from 'typeorm'
import type { ModuleStorage } from '..'
import type { StorageFile } from '../entities'

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

export interface StoragePurgeResult {
  size: number
  count: number
}

export interface StorageUploadOptions {
  abortSignal?: AbortSignal
}

export interface StorageEraseOptions extends RemoveOptions {
  abortSignal?: AbortSignal
}

export abstract class StoragePool {

  /**
   * The unique identifier of the storage pool. This identifier is used to
   * reference a specific storage pool when uploading, downloading, or
   * deleting files.
   */
  id: string

  /**
   * Uploads a file to the storage.
   *
   * @param file The file to upload.
   * @param options The options to use to upload the file.
   */
  upload(file: File, options?: StorageUploadOptions): Promise<StorageFile> {
    throw new Error('Not implemented')
  }

  /**
   * Downloads a file from the storage.
   *
   * @param file The file to download.
   * @param options The options to use to download the file.
   */
  download(file: StorageFile, options?: StorageDownloadOptions): StorageDownloadResult {
    throw new Error('Not implemented')
  }

  /**
   * Deletes a file from the storage.
   *
   * @param file The file to delete.
   */
  erase(file: StorageFile): Promise<void> {
    throw new Error('Not implemented')
  }

  /**
   * Returns the URL of the file in the storage.
   *
   * @param file The file to generate the URL for.
   */
  generateUrl(file: StorageFile): Promise<string> {
    throw new Error('Not implemented')
  }

  /**
   * Purges all the files from the storage that are not referenced by
   * any entity in the database.
   */
  purge(): Promise<StoragePurgeResult> {
    throw new Error('Not implemented')
  }
}
