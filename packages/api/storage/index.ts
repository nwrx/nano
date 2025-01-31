import { ModuleBase } from '@unserved/server'
import { type StoragePoolBase, StoragePoolFS } from './adapters'
import * as ENTITIES from './entities'
import * as ROUTES from './routes'
import * as UTILS from './utils'

export * from './adapters'
export * from './entities'

export interface ModuleStorageOptions {

  /**
   * The storage pools to use for the storage module.
   *
   * @default [new StoragePoolFilesystem({ path: 'storage' })]
   */
  storagePools?: StoragePoolBase[]
}

export class ModuleStorage extends ModuleBase {
  routes = ROUTES
  errors = UTILS.ERRORS
  entities = ENTITIES
  storagePools: StoragePoolBase[] = [
    new StoragePoolFS('Default', { path: './.data/storage' }),
  ]

  constructor(options: ModuleStorageOptions = {}) {
    super()
    if (options.storagePools) this.storagePools = options.storagePools
  }

  initialize = UTILS.initialize.bind(this)
  upload = UTILS.upload.bind(this)
  uploadFromUrl = UTILS.uploadFromUrl.bind(this)
  download = UTILS.download.bind(this)
  resolveFile = UTILS.resolveFile.bind(this)
  respondWith = UTILS.respondWith.bind(this)
  erase = UTILS.erase.bind(this)
}
