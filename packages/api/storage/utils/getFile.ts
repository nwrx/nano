import type { UUID } from 'node:crypto'
import type { StorageFile } from '../entities'
import type { ModuleStorage } from '../index'
import { getPool } from './getPool'

/**
 * Given an ID, return its `StorageFile` entity. If no ID is provided, throw an error.
 * You can also pass `null` to force the function to return `undefined`.
 *
 * @param id The ID of the asset file to resolve.
 * @param pool The pool to search for the asset file.
 * @returns The `StorageFile` entity of the resolved asset file.
 */
export async function getFile(this: ModuleStorage, id: UUID, pool = 'default'): Promise<StorageFile> {
  await getPool.call(this, pool)
  const { StorageFile } = this.getRepositories()
  const file = await StorageFile.findOneBy({ id, pool })
  if (!file) throw this.errors.STORAGE_FILE_NOT_FOUND(id, pool)
  return file
}
