import type { RunnerClient } from './utils/createRunnerClient'
import { ModuleBase } from '@unserved/server'
import { ModuleFlow } from '../flow'
import { ModuleUser } from '../user'
import * as ENTITIES from './entities'
import * as ROUTES from './routes'
import * as UTILS from './utils'

export * from './entities'
export * from './utils/createRunnerClient'

export class ModuleRunner extends ModuleBase {
  routes = ROUTES
  entities = ENTITIES
  errors = UTILS.ERRORS
  dependencies = [ModuleUser, ModuleFlow]
  runnerClients = new Map<string, RunnerClient>()
  requestRunner = UTILS.requestRunner.bind(this)
  initialize = UTILS.initialize.bind(this)
}
