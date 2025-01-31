import type { ThreadRunner } from './utils/registerThreadRunner'
import { ModuleBase } from '@unserved/server'
// import { ModuleFlow } from '../flow'
// import { ModuleUser } from '../user'
import * as ENTITIES from './entities'
import * as ROUTES from './routes'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ModuleFlowOptions {}

export class ModuleThread extends ModuleBase implements ModuleFlowOptions {
  routes = ROUTES
  entities = ENTITIES

  constructor(_options: ModuleFlowOptions = {}) { super() }
  // dependencies = [ModuleUser, ModuleFlow]

  /**
   * A list of URLs that point to the runner threads. The URLs are used to connect to the runner threads
   * and to send events to the master thread. If this array is empty, it means that the thread can be run
   * locally without the need to connect to a remote runner.
   */
  threadRunners = new Map<string, ThreadRunner>()
}
