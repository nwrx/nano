import type { Loose } from '@unshared/types'
import type { ModuleFlow } from '../index'
import { assertStringNotEmpty, assertStringUuid, createSchema } from '@unshared/validation'
import { ModuleWorkspace } from '../../workspace'
import { assertProjectPermission } from '../../workspace/utils'

/** The parser fuction for the {@linkcode resolveProject} function. */
const RESOLVE_FLOW_ENTITY_OPTIONS = createSchema({

  /** The `User` entity trying to resolve the flow. */
  user: createSchema({ id: assertStringUuid }),

  /** The `name` of the `WorkspaceProject` to find. */
  name: assertStringNotEmpty,

  /** The `Project` to find the flow in. */
  project: assertStringNotEmpty,

  /** The `Workspace` to find the project in. */
  workspace: assertStringNotEmpty,

  /** The project permission to assert. */
  permission: assertProjectPermission,
})

/** The options to resolve the project with. */
export type ResolveFlowOptions = Loose<ReturnType<typeof RESOLVE_FLOW_ENTITY_OPTIONS>>

/**
 * Resolves a flow by its name, project, and workspace.
 *
 * @param options The options to resolve the flow with.
 * @returns The resolved flow.
 */
export async function resolveFlow(this: ModuleFlow, options: ResolveFlowOptions) {
  const { user, name, project: projectName, workspace: workspaceName, permission = 'Read' } = RESOLVE_FLOW_ENTITY_OPTIONS(options)

  const workspaceModule = this.getModule(ModuleWorkspace)
  const workspace = await workspaceModule.resolveWorkspace({ user, name: workspaceName, permission: 'Read' })
  const project = await workspaceModule.resolveProject({ user, workspace, name: projectName, permission })

  // --- Find the flow in the workspace.
  const { Flow } = this.getRepositories()
  const result = await Flow.findOne({
    where: { name, project },
    relations: {
      project: {
        secrets: true,
        variables: true,
      },
    },
  })

  // --- Throw an error if the flow was not found.
  if (!result) throw this.errors.FLOW_NOT_FOUND(workspace.name, project.name, name)
  return result
}
