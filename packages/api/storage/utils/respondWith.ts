import type { StorageFile } from '../entities'
import type { ModuleStorage } from '../index'
import type { StorageDownloadOptions } from './createStoragePool'
import { type H3Event, sendRedirect, sendStream, setResponseHeader } from 'h3'
import { download } from './download'

export interface StorageRespondWithOptions extends StorageDownloadOptions {

  /**
   * Add a `Content-Disposition` header to the response. If `true`, the
   * header will be set to `attachment; filename="filename"`. It enforces
   * the browser to download the file instead of displaying it.
   *
   * @default false
   */
  isAttachment?: boolean
}

/**
 * Respond with the given `StorageFile` entity. If the file is stored in
 * a pool that has a public URL, the response will send a redirect to the
 * public URL of the file. Otherwise, the response will send the file as
 * an attachment with the specified content type and content disposition.
 *
 * @param event The `H3Event` object.
 * @param file The file to respond with.
 * @param options The options to use to download the file.
 * @returns A promise that resolves when the response is sent.
 */
export async function respondWith(this: ModuleStorage, event: H3Event, file: StorageFile, options: StorageRespondWithOptions = {}): Promise<void> {
  const { isAttachment, ...downloadOptions } = options
  const result = await download.call(this, file, downloadOptions)

  // --- If the file has a redirect URL, send a redirect.
  if (result.getUrl) {
    const url = await result.getUrl()
    return sendRedirect(event, url)
  }

  // --- Setup the response headers.
  const contentType = await result.getContentType()
  const contentLength = await result.getContentLength()
  setResponseHeader(event, 'Content-Type', contentType)
  setResponseHeader(event, 'Content-Length', contentLength)

  // --- If the `isAttachment` option is set, force the browser to download the file as an attachment.
  if (isAttachment) setResponseHeader(event, 'Content-Disposition', `attachment; filename="${file.name}"`)

  // --- Send the file stream.
  const stream = await result.getStream()
  return sendStream(event, stream)
}
