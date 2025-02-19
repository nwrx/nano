import type { ThreadRunner } from './utils/createThreadRunner'
import { ModuleBase } from '@unserved/server'
import { ModuleFlow } from '../flow'
import { ModuleUser } from '../user'
import * as ENTITIES from './entities'
import * as ROUTES from './routes'
import * as UTILS from './utils'

export * from './entities'

export class ModuleThreadRunner extends ModuleBase {
  routes = ROUTES
  entities = ENTITIES
  errors = UTILS.ERRORS
  dependencies = [ModuleUser, ModuleFlow]

  /**
   * A map of thread runners by their local IDs. This map will be used to store
   * adapter instances that will be used to communicate with the thread runners.
   */
  threadRunners = new Map<string, ThreadRunner>()

  /**
   * Request a thread runner to run a flow. This will query all available thread
   * runners and select the one that has the lowest load. If no thread runners are
   * available, this will throw an error.
   *
   * @returns A `ThreadRunner` instance that can be used to interact with the thread.
   * @example await moduleThreadRunner.requestThreadRunner().createThread({ version: '1', nodes: {} })
   */
  requestThreadRunner = UTILS.requestThreadRunner.bind(this)
}
