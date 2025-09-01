import type { ModuleStorage } from '..'
import type { StorageEraseOptions } from '../adapters'
import { assert, createParser } from '@unshared/validation'
import { assertUser } from '../../user'
import { assertStorageFile } from './assertStorageFile'
import { assertStoragePool } from './assertStoragePool'
import { getPoolAdapter } from './getPoolAdapter'

/** The options schema for the {@linkcode erase} function. */
export const ERASE_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  pool: assertStoragePool,
  file: assertStorageFile,
  abortSignal: assert.instanceOf(AbortSignal),
})

/**
 * Erase a file from the storage. This function will automatically find
 * the storage pool by the file's pool ID and erase the file from the
 * found storage pool. This function will also soft-remove the `StorageFile`
 * entity from the database.
 *
 * @param options The options to use to erase the file.
 */
export async function erase(this: ModuleStorage, options: StorageEraseOptions): Promise<void> {
  const { user, pool, file, abortSignal } = ERASE_OPTIONS_SCHEMA(options)

  // --- Get the adapter for the pool and erase the file.
  const adapter = await getPoolAdapter.call(this, pool)
  await adapter.erase(file, { abortSignal })

  // --- Soft-remove the file entity from the database.
  const { StorageFile } = this.getRepositories()
  await StorageFile.update({ id: file.id }, { deletedBy: user, deletedAt: new Date() })
}
