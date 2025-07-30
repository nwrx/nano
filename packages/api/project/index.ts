import type { EventBus } from '@unserved/server'
import type { UUID } from 'node:crypto'
import { ModuleBase } from '@unserved/server'
import { ModuleFlow } from '../flow'
import { ModuleUser } from '../user'
import { ModuleWorkspace } from '../workspace'
import * as ENTITIES from './entities'
import * as ROUTES from './routes'
import * as UTILS from './utils'

export * from './entities'
export * from './utils/assertProject'
export * from './utils/assertProjectPermission'
export * from './utils/getProjectAssignments'

/**
 * The `ModuleWorkspace` module is used to manage the workflows and modules in the
 * application. The module is used to create, import, edit, and delete workflows and
 * modules in the application.
 */
export class ModuleProject extends ModuleBase {
  errors = UTILS.ERRORS
  routes = ROUTES
  entities = ENTITIES
  dependencies = [
    ModuleUser,
    ModuleFlow,
    ModuleWorkspace,
  ]

  /** A map of project listeners that can be used to listen to project events. */
  projectsEventBus = new Map<UUID, EventBus<UTILS.ProjectEvent>>()

  /**
   * Resolve the {@linkcode Project} with the given name. The function will query the database
   * for the project with the given name and assert that the user has access to the project.
   * If the project is not found or the user does not have access to the project, the function
   * will throw an error.
   *
   * @param options The options to find the project with.
   * @returns The {@linkcode Project} with the given name within the workspace.
   * @example
   * const workspace = moduleWorkspace.getWorkspace({ name: 'my-workspace', permission: 'Read' })
   * await moduleProject.getProject({ name: 'my-project', workspace, permission: 'Read' }) // Project { ... }
   */
  getProject = UTILS.getProject.bind(this)

  /**
   * Get or create the event bus for the project with the given ID. The event bus is used to
   * broadcast events related to the project, such as project creation, deletion, and updates.
   *
   * @param options The options to get the event bus with.
   * @returns The event bus for the project with the given ID.
   * @example
   * const workspace = moduleWorkspace.getWorkspace({ name: 'my-workspace', permission: 'Read' })
   * const project = await moduleProject.getProject({ name: 'my-project', workspace, permission: 'Read' })
   * const eventBus = moduleProject.getEventBus({ workspace, project }) // EventBus<ProjectEvent>
   */
  getEventBus = UTILS.getProjectEventBus.bind(this)
}
