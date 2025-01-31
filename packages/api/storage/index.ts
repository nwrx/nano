import type { StoragePool } from './utils'
import { ModuleBase } from '@unserved/server'
import * as ENTITIES from './entities'
import * as ROUTES from './routes'
import { download, erase, ERRORS, getFile, initialize, respondWith, upload, uploadFromUrl } from './utils'

export * from './entities'

export interface ModuleStorageOptions {

  /**
   * The storage pools to use for the storage module.
   *
   * @default new Map()
   */
  storagePools?: Map<string, StoragePool>
}

export class ModuleStorage extends ModuleBase {
  routes = ROUTES
  errors = ERRORS
  entities = ENTITIES
  storagePools = new Map<string, StoragePool>()

  constructor(options: ModuleStorageOptions = {}) {
    super()
    if (options.storagePools) this.storagePools = options.storagePools
  }

  initialize = initialize.bind(this)
  upload = upload.bind(this)
  uploadFromUrl = uploadFromUrl.bind(this)
  download = download.bind(this)
  getFile = getFile.bind(this)
  respondWith = respondWith.bind(this)
  erase = erase.bind(this)
}
