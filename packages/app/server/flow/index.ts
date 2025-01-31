import type { FlowSession } from './utils'
import { ModuleBase } from '@unserved/server'
import * as ENTITIES from './entities'
import * as ROUTES from './routes'
import { ERRORS, PERMISSIONS, resolveFlowSession, resolveFlowSessionByPeer } from './utils'

export * from './entities'

/**
 * The `ModuleFlow` module is used to manage the workflows and modules in the
 * application. The module is used to create, import, edit, and delete workflows and
 * modules in the application.
 */
export class ModuleFlow extends ModuleBase {
  errors = ERRORS
  routes = ROUTES
  entities = ENTITIES
  permissions = PERMISSIONS

  // constructor(options: Partial<ModuleFlow> = {}) {
  //   super()
  // }

  /**
   * A map of the active flows currently being edited in a socket session.
   */
  flowSessions = new Map<string, FlowSession>()

  /**
   * The base directory in which the flow modules are stored. The modules
   * are stored as .tgz files in this directory and are extracted when
   * imported.
   */
  flowModuleDir = process.env.FLOW_MODULES_DIR ?? '../.data/modules'

  /**
   * Resolve the flow session for the given ID.
   *
   * @param id The ID of the flow session to resolve.
   */
  resolveFlowSession = resolveFlowSession.bind(this)

  /**
   * Find the flow session that the peer is subscribed to.
   *
   * @param peer The peer to find the flow session for.
   * @returns The flow session that the peer is subscribed to.
   */
  resolveFlowSessionByPeer = resolveFlowSessionByPeer.bind(this)
}
