import type { FlowSession } from './utils'
import { ModuleBase } from '@unserved/server'
import { ModuleUser } from '../user'
import { ModuleWorkspace } from '../workspace'
import * as ENTITIES from './entities'
import * as ROUTES from './routes'
import { ERRORS, resolveFlow, resolveFlowModule, resolveFlowSession, resolveFlowSessionByPeer } from './utils'

export * from './entities'
export type * from './utils/createFlowSession'
export type * from './utils/serializeFlowCategories'
export type * from './utils/serializeFlowNode'
export type * from './utils/serializeFlowNodeInstance'
export type * from './utils/serializeFlowSchema'
export type * from './utils/serializeFlowSession'

export interface ModuleFlowOptions {

  /**
   * A map of the active flows currently being edited in a socket session.
   */
  flowModuleDir?: string

  /**
   * The base directory in which the flow modules are stored. The modules
   * are stored as .tgz files in this directory and are extracted when
   * imported.
   */
  flowSessions?: Map<string, FlowSession>
}

/**
 * The `ModuleFlow` module is used to manage the workflows and modules in the
 * application. The module is used to create, import, edit, and delete workflows and
 * modules in the application.
 */
export class ModuleFlow extends ModuleBase implements ModuleFlowOptions {
  constructor(options: ModuleFlowOptions = {}) {
    super()
    if (options.flowSessions) this.flowSessions = options.flowSessions
    if (options.flowModuleDir) this.flowModuleDir = options.flowModuleDir
  }

  errors = ERRORS
  routes = ROUTES
  entities = ENTITIES
  dependencies = [ModuleUser, ModuleWorkspace]

  flowSessions = new Map<string, FlowSession>()
  flowModuleDir = '../.data/modules'
  resolveFlow = resolveFlow.bind(this)
  resolveFlowModule = resolveFlowModule.bind(this)
  resolveFlowSession = resolveFlowSession.bind(this)
  resolveFlowSessionByPeer = resolveFlowSessionByPeer.bind(this)
}
