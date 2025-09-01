import type { Loose } from '@unshared/types'
import type { StorageFile } from '../entities'
import type { ModuleStorage } from '../index'
import { assert, createParser } from '@unshared/validation'
import { In } from 'typeorm'
import { assertUser } from '../../user'
import { assertWorkspace } from '../../workspace'
import { assertStorageFilePermission } from './assertStorageFilePermission'
import { assertStoragePool } from './assertStoragePool'

/** The options schema for the {@linkcode getFile} function. */
const GET_FILE_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  workspace: assertWorkspace,
  pool: assertStoragePool,
  id: assert.stringUuid,
  permission: assertStorageFilePermission,
  withCreatedBy: [[assert.undefined], [assert.boolean]],
  withUpdatedBy: [[assert.undefined], [assert.boolean]],
  withDeleted: [[assert.undefined], [assert.boolean]],
  withAssignments: [[assert.undefined], [assert.boolean]],
})

/** The options for the {@linkcode getFile} function. */
export type GetFileOptions = Loose<ReturnType<typeof GET_FILE_OPTIONS_SCHEMA>>

/**
 * Given an ID, return its `StorageFile` entity. If no ID is provided, throw an error.
 * You can also pass `null` to force the function to return `undefined`.
 *
 * @param options The options for getting the file.
 * @returns The `StorageFile` entity of the resolved asset file.
 */
export async function getFile(this: ModuleStorage, options: GetFileOptions): Promise<StorageFile> {
  const {
    user,
    workspace,
    pool,
    id,
    permission,
    withCreatedBy = false,
    withDeleted = false,
    withAssignments = false,
  } = GET_FILE_OPTIONS_SCHEMA(options)

  // --- Get the file entity.
  const { StorageFile } = this.getRepositories()
  const file = await StorageFile.findOne({
    where: {
      id,
      pool: { id: pool.id },
      assignments: { user, permission: In(['Owner', 'Read']) },
    },
    withDeleted,
    relations: {
      createdBy: withCreatedBy,
      deletedBy: withDeleted,
      assignments: withAssignments ? { user: true } : false,
    },
  })

  // --- Return early if the user has read access.
  if (!file) throw this.errors.STORAGE_FILE_NOT_FOUND(workspace.name, pool.name, id)
  if (permission === 'Read') return file

  // --- Assert that the user has an assignment that matches the permission.
  const { StorageFileAssignment } = this.getRepositories()
  const isAllowed = await StorageFileAssignment.countBy({ user, file, permission: In(['Owner', permission]) })
  if (!isAllowed) throw this.errors.STORAGE_FILE_FORBIDDEN(workspace.name, pool.name, id)
  return file
}
