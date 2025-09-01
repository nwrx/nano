import type { Loose } from '@unshared/types'
import type { StorageFile } from '../entities'
import type { ModuleStorage } from '../index'
import { assert, createParser } from '@unshared/validation'
import { assertUser } from '../../user'
import { assertFileLike } from './assertFileLike'
import { assertStoragePool } from './assertStoragePool'
import { getPoolAdapter } from './getPoolAdapter'

/** The options schema for the {@linkcode upload} function. */
export const UPLOAD_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  pool: assertStoragePool,
  file: assertFileLike,
  abortSignal: [[assert.undefined], [assert.instanceOf(AbortSignal)]],
})

/** The options for the {@linkcode upload} function. */
export type UploadOptions = Loose<ReturnType<typeof UPLOAD_OPTIONS_SCHEMA>>

/**
 * Upload a file to the storage and return the entity.
 *
 * @param options The options to use when uploading the file.
 * @returns The `StorageFile` entity of the uploaded file.
 */
export async function upload(this: ModuleStorage, options: UploadOptions): Promise<StorageFile> {
  const { user, pool, file, abortSignal } = UPLOAD_OPTIONS_SCHEMA(options)

  // --- Get the storage adapter for the pool.
  const adapter = await getPoolAdapter.call(this, pool)
  await adapter.initialize()
  const storageFile = await adapter.upload(file, { abortSignal })

  // --- Save the file metadata to the database.
  const { StorageFile } = this.getRepositories()
  storageFile.pool = pool
  storageFile.createdBy = user
  storageFile.origin = user.username
  return await StorageFile.save(storageFile)
}
