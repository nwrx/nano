import { ModuleBase } from '@unserved/server'
import { ModuleProject } from '../project'
import { ModuleUser } from '../user'
import * as ENTITIES from './entities'
import * as ROUTES from './routes'
import * as UTILS from './utils'

export * from './entities'
export * from './utils/assertFlow'
export * from './utils/assertFlowPermission'

/**
 * The `ModuleFlow` module is used to manage the workflows and modules in the
 * application. The module is used to create, import, edit, and delete workflows and
 * modules in the application.
 */
export class ModuleFlow extends ModuleBase {
  errors = UTILS.ERRORS
  routes = ROUTES
  entities = ENTITIES
  dependencies = [ModuleUser, ModuleProject]

  /**
   * Resolves a flow by its name, project, and workspace.
   *
   * @param options The options to resolve the flow with.
   * @returns The resolved flow.
   */
  getFlow = UTILS.getFlow.bind(this)

  /**
   * Search for the `Flow` with the given name. The function will query the database
   * for the project with the given name and assert that the user has access to the project.
   * If the project is not found or the user does not have access to the project, the function
   * will throw an error.
   *
   * @param options The options to find the project with.
   * @returns The `Flow` with the given name.
   */
  searchFlow = UTILS.searchFlow.bind(this)
}
