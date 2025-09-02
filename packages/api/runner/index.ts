import type { EventBus } from '@unserved/server'
import { createEventBus, ModuleBase } from '@unserved/server'
import * as ENTITIES from './entities'
import * as ROUTES from './routes'
import * as UTILS from './utils'

export * from './entities'
export type * from './utils/createRunnerClient'
export type * from './utils/types'

export interface ModuleRunnerOptions {

  /**
   * The name of the runner. This is used to identify the runner in logs and metrics.
   * It should be a unique identifier for the runner.
   */
  initialRunners: string[]
}

export class ModuleRunner extends ModuleBase implements ModuleRunnerOptions {
  routes = ROUTES
  entities = ENTITIES
  errors = UTILS.ERRORS

  constructor(options: ModuleRunnerOptions) {
    super()
    this.initialRunners = options.initialRunners
  }

  initialRunners: string[] = []
  clients = new Map<string, UTILS.RunnerClient>()
  events = createEventBus<UTILS.RunnersEvent>()
  eventsByRunner = new Map<string, EventBus<UTILS.RunnerEvent>>()
  initialize = UTILS.initialize.bind(this)
  requestRunnerClient = UTILS.requestRunnerClient.bind(this)
}
