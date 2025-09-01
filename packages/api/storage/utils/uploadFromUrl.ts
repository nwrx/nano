import type { StorageFile } from '../entities'
import type { ModuleStorage } from '../index'
import type { FileLike } from './assertFileLike'
import { assert, createParser } from '@unshared/validation'
import { assertUser } from '../../user'
import { assertStoragePool } from './assertStoragePool'
import { upload } from './upload'

/** The options schema for the {@linkcode uploadFromUrl} function. */
export const UPLOAD_FROM_URL_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  pool: assertStoragePool,
  url: assert.stringUrlProtocol('http', 'https'),
  abortSignal: assert.instanceOf(AbortSignal),
})

/** The options for the {@linkcode uploadFromUrl} function. */
export type UploadFromUrlOptions = ReturnType<typeof UPLOAD_FROM_URL_OPTIONS_SCHEMA>

/**
 * Download the data from the provided URL and upload it to the storage.
 *
 * @param this The `ModuleStorage` instance to use to import the file.
 * @param options The options to use when uploading the file.
 * @returns The `StorageFile` entity that was uploaded to the bucket.
 */
export async function uploadFromUrl(this: ModuleStorage, options: UploadFromUrlOptions): Promise<StorageFile> {
  const { user, pool, url, abortSignal } = UPLOAD_FROM_URL_OPTIONS_SCHEMA(options)

  // --- Download the data from the remote URL.
  const response = await fetch(url)
  if (!response.ok) throw this.errors.STORAGE_UPLOAD_FROM_URL_FAILED(response.statusText)
  if (!response.body) throw this.errors.STORAGE_UPLOAD_FROM_URL_EMPTY_BODY()

  // --- Create the `FileLike` object from the response body.
  const file: FileLike = {
    data: response.body,
    name: new URL(response.url).pathname,
    type: response.headers.get('Content-Type') ?? 'application/octet-stream',
  }

  // --- Save the file metadata to the database.
  return upload.call(this, { user, pool, file, abortSignal })
}
