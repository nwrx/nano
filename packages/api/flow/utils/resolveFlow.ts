import type { Loose } from '@unshared/types'
import type { ModuleFlow } from '../index'
import { assertStringNotEmpty, assertStringUuid, createSchema } from '@unshared/validation'

/** The parser fuction for the {@linkcode resolveProject} function. */
const RESOLVE_FLOW_OPTIONS = createSchema({

  /** The `name` of the `WorkspaceProject` to find. */
  name: assertStringNotEmpty,

  /** The `Project` to find the flow in. */
  project: createSchema({ id: assertStringUuid, name: assertStringNotEmpty }),

  /** The `Workspace` to find the project in. */
  workspace: createSchema({ id: assertStringUuid, name: assertStringNotEmpty }),
})

/** The options to resolve the project with. */
export type ResolveFlowOptions = Loose<ReturnType<typeof RESOLVE_FLOW_OPTIONS>>

/**
 * Resolves a flow by its name, project, and workspace.
 *
 * @param options The options to resolve the flow with.
 * @returns The resolved flow.
 */
export async function resolveFlow(this: ModuleFlow, options: ResolveFlowOptions) {
  const { name, project, workspace } = RESOLVE_FLOW_OPTIONS(options)

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
