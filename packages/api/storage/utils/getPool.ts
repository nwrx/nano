import type { Loose } from '@unshared/types'
import type { StoragePool } from '../entities'
import type { ModuleStorage } from '../index'
import { assert, createParser } from '@unshared/validation'
import { In } from 'typeorm'
import { assertUser } from '../../user/utils/assertUser'
import { assertWorkspace } from '../../workspace/utils/assertWorkspace'
import { assertStoragePoolPermission } from './assertStoragePoolPermission'

/** The options schema for the {@linkcode getPool} function. */
const GET_POOL_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  workspace: assertWorkspace,
  name: assert.stringNotEmpty,
  permission: assertStoragePoolPermission,
  withCreatedBy: [[assert.undefined], [assert.boolean]],
  withUpdatedBy: [[assert.undefined], [assert.boolean]],
  withDisabledBy: [[assert.undefined], [assert.boolean]],
  withDeleted: [[assert.undefined], [assert.boolean]],
  withAssignments: [[assert.undefined], [assert.boolean]],
})

/** The options for the {@linkcode getPool} function. */
export type GetPoolOptions = Loose<ReturnType<typeof GET_POOL_OPTIONS_SCHEMA>>

/**
 * Get a pool by name. The pool configuration will only be included if the user
 * has the required permissions to access the pool configuration.
 *
 * @param options The options for getting the pool
 * @returns The pool
 */
export async function getPool(this: ModuleStorage, options: GetPoolOptions): Promise<StoragePool> {
  const {
    user,
    workspace,
    name,
    permission,
    withCreatedBy = false,
    withUpdatedBy = false,
    withDisabledBy = false,
    withDeleted = false,
    withAssignments = false,
  } = GET_POOL_OPTIONS_SCHEMA(options)

  // --- Get the pool entity.
  const { StoragePool } = this.getRepositories()
  const pool = await StoragePool.findOne({
    where: {
      name,
      workspace,
      assignments: { user, permission: In(['Owner', 'Read']) },
    },
    withDeleted,
    relations: {
      createdBy: withCreatedBy,
      updatedBy: withUpdatedBy,
      disabledBy: withDisabledBy,
      deletedBy: withDeleted,
      assignments: withAssignments ? { user: true } : false,
    },
  })

  // --- Return early if the user has read access.
  if (!pool) throw this.errors.STORAGE_POOL_NOT_FOUND(workspace.name, name)
  if (permission === 'Read') return pool

  // --- Assert that the user has an assignment that matches the permission.
  const { StoragePoolAssignment } = this.getRepositories()
  const isAllowed = await StoragePoolAssignment.countBy({ user, pool, permission: In(['Owner', permission]) })
  if (!isAllowed) throw this.errors.STORAGE_POOL_FORBIDDEN(workspace.name, name)
  return pool
}
