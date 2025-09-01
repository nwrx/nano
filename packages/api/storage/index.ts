import type { CipherGCMTypes } from 'node:crypto'
import type { StoragePool } from './entities'
import type { StoragePoolConfiguration, StoragePoolType } from './utils'
import { ModuleBase } from '@unserved/server'
import * as ENTITIES from './entities'
import * as ROUTES from './routes'
import * as UTILS from './utils'

export * from './entities'

/** The configuration for a storage pool. */
export interface ModuleStorageOptions {

  /**
   * The default storage pool type.
   */
  publicPoolType: StoragePoolType

  /**
   * The initial storage pools to register with the storage module.
   */
  publicPoolConfiguration: StoragePoolConfiguration

  /**
   * The secret used to encrypt the storage pool configuration in
   * the database. This is used to protect sensitive information
   * such as access keys and secret keys.
   */
  encryptionKey: string

  /**
   * The algorithm used to encrypt the storage pool configuration.
   * This should match the algorithm used to encrypt the storage pool
   * configuration in the database.
   */
  encryptionAlgorithm: CipherGCMTypes
}

/**
 * The `ModuleStorage` class handlers all storage-related operations in the
 * application. It provides methods to upload, download, erase files, and
 * respond with files. It also manages user-defined storage pools and
 * their configurations.
 */
export class ModuleStorage extends ModuleBase implements ModuleStorageOptions {
  routes = ROUTES
  errors = UTILS.ERRORS
  entities = ENTITIES

  publicPool: StoragePool | undefined
  publicPoolType: StoragePoolType
  publicPoolConfiguration: StoragePoolConfiguration
  encryptionKey: string
  encryptionAlgorithm: CipherGCMTypes

  constructor(options: ModuleStorageOptions) {
    super()
    this.publicPoolType = options.publicPoolType
    this.publicPoolConfiguration = options.publicPoolConfiguration
    this.encryptionKey = options.encryptionKey
    this.encryptionAlgorithm = options.encryptionAlgorithm
  }

  upload = UTILS.upload.bind(this)
  uploadFromUrl = UTILS.uploadFromUrl.bind(this)
  download = UTILS.download.bind(this)
  getFile = UTILS.getFile.bind(this)
  getPool = UTILS.getPool.bind(this)
  getPublicPool = UTILS.getPublicPool.bind(this)
  getPublicPoolAdapter = UTILS.getPublicPoolAdapter.bind(this)
  respondWith = UTILS.respondWith.bind(this)
  erase = UTILS.erase.bind(this)
}
