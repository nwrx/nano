import { ModuleBase } from '@unserved/server'
import { ModuleUser } from '../user'
import { ModuleVault } from '../vault'
import * as ENTITIES from './entities'
import * as ROUTES from './routes'
import * as UTILS from './utils'

export * from './entities'
export type * from './utils/assertMcpPool'
export type * from './utils/assertMcpPoolPermission'
export type * from './utils/types'

export class ModuleMcpPool extends ModuleBase {
  routes = ROUTES
  entities = ENTITIES
  errors = UTILS.ERRORS
  dependencies = [ModuleUser, ModuleVault]
  getPool = UTILS.getMcpPool.bind(this)
  getPoolManager = UTILS.getMcpPoolManager.bind(this)
  getPoolGateway = UTILS.getMcpPoolGateway.bind(this)
}
