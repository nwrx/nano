import { ModuleBase } from '@unserved/server'
import * as ENTITIES from './entities'
import * as ROUTES from './routes'
import { ERRORS, getIcon } from './utils'

export * from './entities'

export class ModuleIcon extends ModuleBase {
  errors = ERRORS
  routes = ROUTES
  entities = ENTITIES
  getIcon = getIcon.bind(this)
}
