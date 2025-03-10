import type { ThreadRunnerClient } from './utils/createThreadRunner'
import { ModuleBase } from '@unserved/server'
import { ModuleFlow } from '../flow'
import { ModuleUser } from '../user'
import * as ENTITIES from './entities'
import * as ROUTES from './routes'
import * as UTILS from './utils'

export * from './entities'

export class ModuleThreadRunner extends ModuleBase {
  routes = ROUTES
  entities = ENTITIES
  errors = UTILS.ERRORS
  dependencies = [ModuleUser, ModuleFlow]
  threadRunners = new Map<string, ThreadRunnerClient>()
  requestThreadRunner = UTILS.requestThreadRunner.bind(this)
  initialize = UTILS.initialize.bind(this)
}
