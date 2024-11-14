import type { ModuleWorkspace } from '../index'
import { assertStringNotEmpty, assertStringUuid, createSchema } from '@unshared/validation'

/** A parser for the delete project variable options. */
export const DELETE_PROJECT_VARIABLE_OPTIONS = createSchema({

  /** The user responsible for deleting the project variable. */
  user: createSchema({ id: assertStringUuid }),

  /** The workspace to delete the project variable from. */
  workspace: assertStringNotEmpty,

  /** The project to delete the variable from. */
  project: assertStringNotEmpty,

  /** The name of the variable to delete. */
  name: assertStringNotEmpty,
})

/** The options to delete the project variable with. */
export type DeleteProjectVariableOptions = ReturnType<typeof DELETE_PROJECT_VARIABLE_OPTIONS>

/**
 * Delete a variable from a project.
 *
 * @param options The options required to delete the variable.
 * @returns A promise that resolves when the variable is deleted.
 */
export async function deleteProjectVariable(this: ModuleWorkspace, options: DeleteProjectVariableOptions): Promise<void> {
  const { WorkspaceProjectVariable } = this.getRepositories()
  const { user, workspace: workspaceName, project: projectName, name } = DELETE_PROJECT_VARIABLE_OPTIONS(options)

  // --- Resolve the workspace and project and check if the user can delete the variable.
  const workspace = await this.resolveWorkspace({ user, name: workspaceName, permission: 'Read' })
  const project = await this.resolveProject({ workspace, name: projectName, permission: 'WriteVariables' })

  // --- Delete the variable.
  await WorkspaceProjectVariable.delete({ project, name })
}
