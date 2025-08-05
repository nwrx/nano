import type { EventBus } from '@unserved/server'
import { createEventBus, ModuleBase } from '@unserved/server'
import { ModuleFlow } from '../flow'
import { ModuleUser } from '../user'
import * as ENTITIES from './entities'
import * as ROUTES from './routes'
import * as UTILS from './utils'

export * from './entities'
export type * from './utils/createRunnerClient'
export type * from './utils/types'

export class ModuleRunner extends ModuleBase {
  routes = ROUTES
  entities = ENTITIES
  errors = UTILS.ERRORS
  dependencies = [ModuleUser, ModuleFlow]
  clients = new Map<string, UTILS.RunnerClient>()
  events = createEventBus<UTILS.RunnersEvent>()
  eventsByRunner = new Map<string, EventBus<UTILS.RunnerEvent>>()
  requestRunner = UTILS.requestRunner.bind(this)
}
