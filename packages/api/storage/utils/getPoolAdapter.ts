import type { StoragePoolAdapter } from '../adapters/createStoragePoolAdapter'
import type { StoragePoolAzureOptions } from '../adapters/createStoragePoolAzure'
import type { StoragePoolFSOptions } from '../adapters/createStoragePoolFs'
import type { StoragePoolGcsOptions } from '../adapters/createStoragePoolGcs'
import type { StoragePoolS3Options } from '../adapters/createStoragePoolS3'
import type { StoragePool } from '../entities'
import type { ModuleStorage } from '../index'
import { decrypt } from '../../utils'
import { createStoragePoolAzure } from '../adapters/createStoragePoolAzure'
import { createStoragePoolFs } from '../adapters/createStoragePoolFs'
import { createStoragePoolGcs } from '../adapters/createStoragePoolGcs'
import { createStoragePoolS3 } from '../adapters/createStoragePoolS3'

/**
 * Given a `StoragePool` entity, return its adapter instance.
 *
 * @param pool The options to get the storage pool adapter.
 * @returns The storage pool adapter instance.
 */
export async function getPoolAdapter(this: ModuleStorage, pool: StoragePool): Promise<StoragePoolAdapter> {
  const configurationJson = await decrypt(pool.configuration, this.encryptionKey)
  const configuration = JSON.parse(configurationJson) as object
  if (pool.type === 'azure') return createStoragePoolAzure(configuration as StoragePoolAzureOptions)
  if (pool.type === 'gcs') return createStoragePoolGcs(configuration as StoragePoolGcsOptions)
  if (pool.type === 'fs') return createStoragePoolFs(configuration as StoragePoolFSOptions)
  if (pool.type === 's3') return createStoragePoolS3(configuration as StoragePoolS3Options)
  throw this.errors.STORAGE_POOL_ADAPTER_NOT_IMPLEMENTED(pool.type)
}
