import { ModuleBase } from '@unserved/server'
import { ModuleMcpServer } from '../mcpServer'
import * as ENTITIES from './entities'
// import * as ROUTES from './routes'
// import * as UTILS from './utils'

export * from './entities'
// export type * from './utils/assertMcpServer'
// export type * from './utils/assertMcpServerSpec'
// export type * from './utils/assertMcpServerTransportType'
// export type * from './utils/types'

export class ModuleMcpServerEvent extends ModuleBase {
  // routes = ROUTES
  entities = ENTITIES
  // errors = UTILS.ERRORS
  dependencies = [ModuleMcpServer]
  // getServer = UTILS.getMcpServer.bind(this)
}
