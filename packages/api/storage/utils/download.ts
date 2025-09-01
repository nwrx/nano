import type { Loose } from '@unshared/types'
import type { StorageDownloadResult } from '../adapters'
import type { ModuleStorage } from '../index'
import { assert, createParser } from '@unshared/validation'
import { assertStorageFile } from './assertStorageFile'
import { assertStoragePool } from './assertStoragePool'
import { getPoolAdapter } from './getPoolAdapter'

/** The options schema for the {@linkcode download} function.  */
export const DOWNLOAD_OPTIONS_SCHEMA = createParser({
  pool: assertStoragePool,
  file: assertStorageFile,
  offset: [[assert.undefined], [assert.numberInteger, assert.numberPositiveStrict]],
  size: [[assert.undefined], [assert.numberInteger, assert.numberPositiveStrict]],
  abortSignal: [[assert.undefined], [assert.instanceOf(AbortSignal)]],
})

/** The options for the {@linkcode download} function. */
export type DownloadOptions = Loose<ReturnType<typeof DOWNLOAD_OPTIONS_SCHEMA>>

/**
 * Download a file from the storage and return the result. This function
 * will automatically find the storage pool by the file's pool ID and
 * download the file from the found storage pool.
 *
 * @param options The options to use to download the file.
 * @returns The result of the download operation.
 */
export async function download(this: ModuleStorage, options: DownloadOptions): Promise<StorageDownloadResult> {
  const { pool, file, offset, size, abortSignal } = DOWNLOAD_OPTIONS_SCHEMA(options)
  const adapter = await getPoolAdapter.call(this, pool)
  await adapter.initialize()
  return adapter.download(file, { offset, size, abortSignal })
}
