import type { EventBus } from '@unserved/server'
import { ModuleBase } from '@unserved/server'
import { ModuleFlow } from '../flow'
import { ModuleUser } from '../user'
import * as ENTITIES from './entities'
import * as ROUTES from './routes'
import * as UTILS from './utils'

export * from './entities'

export class ModuleThread extends ModuleBase {
  routes = ROUTES
  entities = ENTITIES
  errors = UTILS.ERRORS
  dependencies = [ModuleUser, ModuleFlow]
  sessions = new Map<string, EventBus<ENTITIES.ThreadEventObject>>()
}
