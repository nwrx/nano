import { ModuleBase } from '@unserved/server'
import { ModuleProject } from '../project'
import { ModuleUser } from '../user'
import * as ENTITIES from './entities'
import * as ROUTES from './routes'
import * as UTILS from './utils'

export * from './entities'
export * from './utils/assertWorkspace'
export * from './utils/assertWorkspacePermission'

export class ModuleWorkspace extends ModuleBase {
  routes = ROUTES
  entities = ENTITIES
  errors = UTILS.ERRORS
  dependencies = [ModuleUser, ModuleProject]

  /**
   * Assign a user to a workspace with the given permission. The function will create a new
   * assignment for the user and workspace with the given permission. The function will throw
   * an error if the user is already assigned to the workspace with the same permission.
   *
   * @param options The options to assign the user to the workspace with.
   * @returns The newly created `WorkspaceAssignment` entity.
   * @example await moduleWorkspace.assignWorkspace({ user, workspace, permission: 'Write' }) // WorkspaceAssignment { ... }
   */
  assignWorkspace = UTILS.assignWorkspace.bind(this)

  /**
   * Create a new workspace with the given name and title. The function will create a new
   * workspace with the given name and title and assign the user to the workspace with full
   * access. The function will throw an error if the workspace already exists.
   *
   * @param options The options to create the workspace with.
   * @returns The newly created `Workspace` entity.
   * @example await moduleWorkspace.createWorkspace({ name: 'my-workspace', user }) // Workspace { ... }
   */
  createWorkspace = UTILS.createWorkspace.bind(this)

  /**
   * Resolve the {@linkcode Workspace} with the given name. The function will query the database
   * for the workspace with the given name and assert that the user has access to the
   * workspace. If the workspace is not found or the user does not have access to the
   * workspace, the function will throw an error.
   *
   * @param options The options to find the workspace with.
   * @returns The {@linkcode Workspace} with the given name.
   * @example await moduleWorkspace.getWorkspace({ name: 'my-workspace', permission: 'Read' }) // Workspace { ... }
   */
  getWorkspace = UTILS.getWorkspace.bind(this)
}
