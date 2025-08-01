import { ModuleBase } from '@unserved/server'
import * as ENTITIES from './entities'
import * as ROUTES from './routes'
import * as UTILS from './utils'

export type * from './entities'
export type * from './utils/assertRegistryCategory'
export type * from './utils/assertRegistryCollection'
export type * from './utils/assertRegistryComponent'

export class ModuleRegistry extends ModuleBase {
  entities = ENTITIES
  errors = UTILS.ERRORS
  routes = ROUTES
  resolveComponent = UTILS.resolveComponent.bind(this)
}
