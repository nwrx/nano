import type { UUID } from 'node:crypto'
import type { StorageFile } from '../entities'
import type { ModuleStorage } from '../index'

/**
 * Given an ID, return its `StorageFile` entity. If no ID is provided, throw an error.
 * You can also pass `null` to force the function to return `undefined`.
 *
 * @param id The ID of the asset file to resolve.
 * @returns The `StorageFile` entity of the resolved asset file.
 */
export async function resolveFile(this: ModuleStorage, id: UUID): Promise<StorageFile> {

  // --- Find the file given the ID.
  const { StorageFile } = this.getRepositories()
  const file = await StorageFile.findOneBy({ id })

  // --- Assert that the file exists.
  if (!file) throw this.errors.STORAGE_FILE_NOT_FOUND(id)
  return file
}
