import type { FlowSessionInstance } from './utils'
import { ModuleBase } from '@unserved/server'
import { ModuleUser } from '../user'
import { ModuleWorkspace } from '../workspace'
import * as ENTITIES from './entities'
import * as ROUTES from './routes'
import * as UTILS from './utils'

export * from './entities'
export type * from './utils/resolveFlowSession'
export type * from './utils/serializeFlowSession'

export interface ModuleFlowOptions {

  /**
   * The base directory in which the flow modules are stored. The modules
   * are stored as .tgz files in this directory and are extracted when
   * imported.
   */
  flowSessions?: Map<string, FlowSessionInstance>
}

/**
 * The `ModuleFlow` module is used to manage the workflows and modules in the
 * application. The module is used to create, import, edit, and delete workflows and
 * modules in the application.
 */
export class ModuleFlow extends ModuleBase implements ModuleFlowOptions {
  errors = UTILS.ERRORS
  routes = ROUTES
  entities = ENTITIES
  dependencies = [ModuleUser, ModuleWorkspace]
  flowSessions = new Map<string, FlowSessionInstance>()

  constructor(options: ModuleFlowOptions = {}) {
    super()
    if (options.flowSessions) this.flowSessions = options.flowSessions
  }

  resolveFlow = UTILS.resolveFlowEntity.bind(this)
}
