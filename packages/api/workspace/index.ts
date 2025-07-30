import type { EventBus } from '@unserved/server'
import { ModuleBase } from '@unserved/server'
import { ModuleProject } from '../project'
import { ModuleUser } from '../user'
import * as ENTITIES from './entities'
import * as ROUTES from './routes'
import * as UTILS from './utils'

export * from './entities'
export * from './utils/assertWorkspace'
export * from './utils/assertWorkspacePermission'
export * from './utils/getWorkspaceAssignments'

export class ModuleWorkspace extends ModuleBase {
  routes = ROUTES
  entities = ENTITIES
  errors = UTILS.ERRORS
  dependencies = [ModuleUser, ModuleProject]
  workspaceEventBus = new Map<string, EventBus<UTILS.WorkspaceEvent>>()
  assignWorkspace = UTILS.assignWorkspace.bind(this)
  createWorkspace = UTILS.createWorkspace.bind(this)
  getWorkspace = UTILS.getWorkspace.bind(this)
  getEventBus = UTILS.getWorkspaceEventBus.bind(this)
}
