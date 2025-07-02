import { ModuleBase } from '@unserved/server'
import { ModuleUser } from '../user'
import { ModuleVault } from '../vault'
import * as ENTITIES from './entities'
import * as ROUTES from './routes'
import * as UTILS from './utils'

export * from './entities'
export * from './utils/assertMcpGateway'
export type * from './utils/types'

export class ModuleMcpGateway extends ModuleBase {
  routes = ROUTES
  entities = ENTITIES
  errors = UTILS.ERRORS
  dependencies = [ModuleUser, ModuleVault]
  gateways = new Map<string, UTILS.McpGatewayClient>()
  getGatewayClient = UTILS.getGatewayClient.bind(this)
}
