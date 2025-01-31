import { ModuleBase } from '@unserved/server'
import { ModuleUser } from '../user'
import { ModuleWorkspace } from '../workspace'
import * as ENTITIES from './entities'
import * as ROUTES from './routes'
import * as UTILS from './utils'

export * from './entities'
export * from './utils/chatClientMessage'
export * from './utils/chatMessageData'
export * from './utils/chatServerMessage'

export class ModuleChat extends ModuleBase {
  errors = UTILS.ERRORS
  routes = ROUTES
  entities = ENTITIES
  dependencies = [ModuleUser, ModuleWorkspace]
  chatSessions = new Map<string, UTILS.ChatSession>()
}
