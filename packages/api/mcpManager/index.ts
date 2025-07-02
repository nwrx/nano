import { ModuleBase } from '@unserved/server'
import { ModuleUser } from '../user'
import { ModuleVault } from '../vault'
import * as ENTITIES from './entities'
import * as ROUTES from './routes'
import * as UTILS from './utils'

export * from './entities'
export * from './utils/assertMcpManager'
export type * from './utils/types'

export class ModuleMcpManager extends ModuleBase {
  routes = ROUTES
  entities = ENTITIES
  errors = UTILS.ERRORS
  dependencies = [ModuleUser, ModuleVault]
  managers = new Map<string, UTILS.McpManagerClient>()
  getManager = UTILS.getManager.bind(this)
  getManagerClient = UTILS.getManagerClient.bind(this)
  requestManager = UTILS.requestManager.bind(this)
}
