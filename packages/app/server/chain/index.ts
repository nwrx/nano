import { ModuleBase } from '@unserved/server'
import {
  ChainSession,
  ERRORS,
  PERMISSIONS,
  resolveChainSession,
  resolveChainSessionByPeer,
} from './utils'
import * as ROUTES from './routes'
import * as ENTITIES from './entities'

export * from './entities'

/**
 * The "Icon" module provides a way to manage icons for the website content
 * using the Iconify CDN. The icons are stored as assets in the asset module.
 */
export class ModuleChain extends ModuleBase {
  errors = ERRORS
  routes = ROUTES
  entities = ENTITIES
  permissions = PERMISSIONS

  // constructor(options: Partial<ModuleChain> = {}) {
  //   super()
  // }

  /**
   * A map of the active chains currently being edited in a socket session.
   */
  chainsSessions = new Map<string, ChainSession>()

  /**
   * The base directory in which the chain modules are stored. The modules
   * are stored as .tgz files in this directory and are extracted when
   * imported.
   */
  chainModulesDir = process.env.CHAIN_MODULES_DIR ?? '../.data/modules'

  /**
   * Resolve the chain session for the given ID.
   *
   * @param id The ID of the chain session to resolve.
   */
  resolveChainSession = resolveChainSession.bind(this)

  /**
   * Find the chain session that the peer is subscribed to.
   *
   * @param peer The peer to find the chain session for.
   * @returns The chain session that the peer is subscribed to.
   */
  resolveChainSessionByPeer = resolveChainSessionByPeer.bind(this)
}
