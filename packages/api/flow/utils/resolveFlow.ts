import type { H3Event } from 'h3'
import type { FindOptionsRelations } from 'typeorm'
import type { WorkspaceProjectPermission } from '@nwrx/api'
import type { Flow } from '../entities'
import type { ModuleFlow } from '../index'
import { ModuleWorkspace } from '@nwrx/api'

export interface ResolveFlowOptions {

  /**
   * The name of the flow to find.
   *
   * @example 'my-flow'
   */
  flowName: string

  /**
   * The username of the owner of the project. This is used to find the project
   * attached to the owner with the given slug.
   *
   * @example 'john-doe'
   */
  projectOwner: string

  /**
   * The name of the project to find. This is used to find the project with the
   * given slug or ID.
   *
   * @example 'resume-article'
   */
  projectName: string

  /**
   * The relations to include in the resolved `Flow`. If provided, the
   * specified relations will be fetched and included in the resolved project.
   *
   * @default true
   */
  relations?: FindOptionsRelations<Flow> | true

  /**
   * A map of permissions required to access the project.
   *
   * @default ['Owner']
   */
  permissions?: WorkspaceProjectPermission[]
}

export async function resolveFlow(this: ModuleFlow, event: H3Event, options: ResolveFlowOptions) {
  const { flowName, projectOwner, projectName, relations = true, permissions } = options

  // --- Check if the user has the right permissions.
  const projectModule = this.getModule(ModuleWorkspace)
  const project = await projectModule.resolveProject(event, {
    owner: projectOwner,
    name: projectName,
    relations: { flows: relations },
    permission: permissions,
  })

  // --- Search for the flow in the project.
  const flow = project.flows!.find(flow => flow.name === flowName)
  if (!flow) throw this.errors.FLOW_NOT_FOUND(flowName)
  return flow
}
