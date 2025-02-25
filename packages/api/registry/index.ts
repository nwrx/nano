import { ModuleBase } from '@unserved/server'
import * as ENTITIES from './entities'
import * as ROUTES from './routes'
import * as UTILS from './utils'

export type * from './entities'
export type * from './utils/assertRegistryCategory'
export type * from './utils/assertRegistryCollection'
export type * from './utils/assertRegistryComponent'

/**
 * The `ModuleFlow` module is used to manage the workflows and modules in the
 * application. The module is used to create, import, edit, and delete workflows and
 * modules in the application.
 */
export class ModuleRegistry extends ModuleBase {
  entities = ENTITIES
  errors = UTILS.ERRORS
  routes = ROUTES
  initialize(): Promise<void> {
    return UTILS.initialize.call(this)
  }
}
