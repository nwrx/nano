/* eslint-disable n/no-unsupported-features/node-builtins */
import type { FileLike } from '../adapters'
import type { StorageFile } from '../entities'
import type { ModuleStorage } from '../index'

/**
 * Download the data from the provided URL and upload it to the storage.
 *
 * @param this The `ModuleStorage` instance to use to import the file.
 * @param url The URL of the data to import to the bucket.
 * @param metadata Override the `FileLike` object with the provided data.
 * @returns The `StorageFile` entity that was uploaded to the bucket.
 */
export async function uploadFromUrl(this: ModuleStorage, url: URL | string, metadata: Partial<FileLike> = {}): Promise<StorageFile> {

  // --- Download the data from the remote URL.
  const data = await fetch(url)
  if (!data.ok) throw new Error(`Could not download the file from the URL: ${data.statusText}`)
  if (!data.body) throw new Error('The response body is empty')

  // --- Get the type and size of the data from the headers.
  const type = data.headers.get('Content-Type')
  const size = data.headers.get('Content-Length')
  if (!type) throw new Error('Could not determine the type of the file')
  if (!size) throw new Error('Could not determine the size of the file')

  // --- Pass the stream to the `upload` method and return the file.
  return await this.upload({
    stream: () => data.body as ReadableStream,
    name: new URL(data.url).pathname,
    source: url.toString(),
    ...metadata,
    size: Number(size),
    type,
  })
}
