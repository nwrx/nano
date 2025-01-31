import type { StoragePool } from './utils/createStorageAdapter'
import { ModuleBase } from '@unserved/server'
import * as ENTITIES from './entities'
import * as ROUTES from './routes'
import * as UTILS from './utils'

export * from './entities'
export * from './utils/fileToStream'

export class ModuleStorage extends ModuleBase {
  routes = ROUTES
  errors = UTILS.ERRORS
  entities = ENTITIES
  adapters: StoragePool[] = []

  uploadFromUrl = UTILS.uploadFromUrl.bind(this)
  fileToStream = UTILS.fileToStream.bind(this)
  resolveFile = UTILS.resolveFile.bind(this)
}
