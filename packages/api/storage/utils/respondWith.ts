import type { Loose } from '@unshared/types'
import type { H3Event } from 'h3'
import type { ModuleStorage } from '../index'
import { assert, createParser } from '@unshared/validation'
import { sendRedirect, sendStream, setResponseHeader } from 'h3'
import { assertStorageFile } from './assertStorageFile'
import { assertStoragePool } from './assertStoragePool'
import { download } from './download'

/** The options schema for the {@linkcode respondWith} function. */
export const STORAGE_RESPOND_WITH_OPTIONS_SCHEMA = createParser({
  pool: assertStoragePool,
  file: assertStorageFile,
  offset: [[assert.undefined], [assert.numberInteger, assert.numberPositiveStrict]],
  size: [[assert.undefined], [assert.numberInteger, assert.numberPositiveStrict]],
  isAttachment: [[assert.undefined], [assert.boolean]],
  abortSignal: [[assert.undefined], [assert.instanceOf(AbortSignal)]],
})

/** The options for the {@linkcode respondWith} function. */
export type StorageRespondWithOptions = Loose<ReturnType<typeof STORAGE_RESPOND_WITH_OPTIONS_SCHEMA>>

/**
 * Respond with the given `StorageFile` entity. If the file is stored in
 * a pool that has a public URL, the response will send a redirect to the
 * public URL of the file. Otherwise, the response will send the file as
 * an attachment with the specified content type and content disposition.
 *
 * @param event The `H3Event` object.
 * @param options The options to use to download the file.
 * @returns A promise that resolves when the response is sent.
 */
export async function respondWith(this: ModuleStorage, event: H3Event, options: StorageRespondWithOptions): Promise<void> {
  const { pool, file, offset, size, isAttachment, abortSignal } = STORAGE_RESPOND_WITH_OPTIONS_SCHEMA(options)
  const result = await download.call(this, { file, pool, offset, size, abortSignal })

  // --- Check if we should redirect to a custom download URL or proxy through the API.
  if (result.getUrl && this.publicDownloadUrl) {
    const url = new URL(await result.getUrl())
    url.hostname = this.publicDownloadUrl.hostname
    url.protocol = this.publicDownloadUrl.protocol
    url.port = '' // Assume default port
    return sendRedirect(event, url.toString())
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
