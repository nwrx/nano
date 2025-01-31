import type { StorageFile } from '../entities'
import type { ModuleStorage } from '../index'
import type { FileLike } from './fileToStream'

export type UploadFromUrlOptions =
  Omit<FileLike, 'data' | 'name' | 'origin' | 'size' | 'type'>

/**
 * Download the data from the provided URL and upload it to the storage.
 *
 * @param this The `ModuleStorage` instance to use to import the file.
 * @param url The URL of the data to import to the bucket.
 * @param options The options to use when uploading the file.
 * @returns The `StorageFile` entity that was uploaded to the bucket.
 */
export async function uploadFromUrl(this: ModuleStorage, url: string | URL, options: UploadFromUrlOptions): Promise<StorageFile> {

  // --- Download the data from the remote URL.
  const response = await fetch(url)
  if (!response.ok) throw this.errors.STORAGE_UPLOAD_FROM_URL_FAILED(response.statusText)
  if (!response.body) throw this.errors.STORAGE_UPLOAD_FROM_URL_EMPTY_BODY()

  // --- Get the type and size of the data from the headers.
  const type = response.headers.get('Content-Type')
  const size = response.headers.get('Content-Length')
  if (!type) throw this.errors.STORAGE_UPLOAD_FROM_URL_NO_CONTENT_TYPE()
  if (!size) throw this.errors.STORAGE_UPLOAD_FROM_URL_NO_CONTENT_LENGTH()

  // --- Pass the stream to the `upload` method and return the file.
  return await this.upload({
    data: response.body,
    name: new URL(response.url).pathname,
    origin: new URL(response.url).origin,
    size: Number(size),
    type,
    ...options,
  })
}
