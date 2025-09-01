import type { Loose } from '@unshared/types'
import type { StoragePool } from '../entities'
import type { ModuleStorage } from '../index'
import type { StoragePoolConfiguration } from './types'
import { assert, createParser } from '@unshared/validation'
import { assertUser } from '../../user'
import { encrypt } from '../../utils'
import { assertWorkspace } from '../../workspace'
import { assertStoragePoolType } from './assertStoragePoolType'

const CREATE_STORAGE_POOL_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  workspace: assertWorkspace,
  type: assertStoragePoolType,
  name: assert.stringNotEmpty,
  configuration: assert.objectStrict as (value: unknown) => asserts value is StoragePoolConfiguration,
})

/** The options for creating the storage pool. */
export type CreateStoragePoolOptions = Loose<ReturnType<typeof CREATE_STORAGE_POOL_OPTIONS_SCHEMA>>

/**
 * Creates a new storage pool for storing files. The function will create a new `StoragePool` entity
 * with the given options and assign the user to the pool with full access. The function will
 * throw an error if the pool already exists in the workspace.
 *
 * @param options The options for creating the storage pool
 * @returns The newly created `StoragePool` entity.
 */
export async function createStoragePool(this: ModuleStorage, options: CreateStoragePoolOptions): Promise<StoragePool> {
  const { user, workspace, type, name, configuration } = CREATE_STORAGE_POOL_OPTIONS_SCHEMA(options)

  // --- Assert that no pool with the same name exists in the workspace.
  const { StoragePool } = this.getRepositories()
  const exists = await StoragePool.countBy({ name, workspace })
  if (exists > 0) throw this.errors.STORAGE_POOL_ALREADY_EXISTS(workspace.name, name)

  // --- Encrypt the configuration using the module's encryption key.
  const configurationJson = JSON.stringify(configuration)
  const configurationEncrypted = await encrypt(
    configurationJson,
    this.configurationEncryptionKey,
    this.configurationEncryptionAlgorithm,
  )

  // --- Create the pool and assign the user to it.
  const { StoragePoolAssignment } = this.getRepositories()
  const assignment = StoragePoolAssignment.create({ user, permission: 'Owner', createdBy: user })
  return StoragePool.create({
    createdBy: user,
    type,
    name,
    workspace,
    configuration: configurationEncrypted,
    assignments: [assignment],
  })
}
