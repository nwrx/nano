import { ModuleBase } from '@unserved/server'
import { ModuleUser } from '../user'
import { ModuleWorkspace } from '../workspace'
import * as ENTITIES from './entities'
import * as ROUTES from './routes'
import * as UTILS from './utils'

export * from './entities'
export * from './utils/types'

export class ModuleMonitoring extends ModuleBase {
  errors = UTILS.ERRORS
  routes = ROUTES
  entities = ENTITIES
  dependencies = [ModuleUser, ModuleWorkspace]

  constructor() {
    super()
  }

  captureThreadEvents = UTILS.captureThreadEvents.bind(this)
}
