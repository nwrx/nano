import { ModuleBase } from '@unserved/server'
import { ModuleMcpManager } from '../mcpManager'
import { ModuleUser } from '../user'
import { ModuleVault } from '../vault'
import * as ENTITIES from './entities'
import * as ROUTES from './routes'
import * as UTILS from './utils'

export * from './entities'

export class ModuleMcpServerVariable extends ModuleBase {
  routes = ROUTES
  entities = ENTITIES
  errors = UTILS.ERRORS
  dependencies = [
    ModuleUser,
    ModuleVault,
    ModuleMcpManager,
  ]
}
