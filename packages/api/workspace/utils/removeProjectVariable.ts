import type { Loose } from '@unshared/types'
import type { ModuleWorkspace } from '..'
import { assertStringNotEmpty, assertStringUuid, assertUndefined, createSchema } from '@unshared/validation'

/** A parser for the remove project variable options. */
export const REMOVE_PROJECT_VARIABLE_OPTIONS = createSchema({

  /** The user responsible for deleting the project variable. */
  user: [[assertUndefined], [createSchema({ id: assertStringUuid })]],

  /** The workspace to remove the variable in. */
  workspace: assertStringNotEmpty,

  /** The project to remove the variable for. */
  project: assertStringNotEmpty,

  /** The name of the variable to remove. */
  name: assertStringNotEmpty,
})

/** The options to remove the project variable with. */
export type RemoveProjectVariableOptions = Loose<ReturnType<typeof REMOVE_PROJECT_VARIABLE_OPTIONS>>

/**
 * Remove the variable for the project with the given name. The function will remove
 * the variable with the given name and assign the user to the variable with the given
 * permission level. The function will throw an error if the variable does not exist
 * in the project.
 *
 * @param options The options to remove the project variable with.
 * @returns The removed variable value.
 */
export async function removeProjectVariable(this: ModuleWorkspace, options: RemoveProjectVariableOptions): Promise<void> {
  const { WorkspaceProjectVariable } = this.getRepositories()
  const { user, workspace: workspaceName, project: projectName, name } = REMOVE_PROJECT_VARIABLE_OPTIONS(options)

  // --- Resolve the workspace and project and check if the user can remove the variable.
  const workspace = await this.resolveWorkspace({ user, name: workspaceName, permission: 'Read' })
  const project = await this.resolveProject({ workspace, name: projectName, permission: 'WriteVariables' })
  const variable = await WorkspaceProjectVariable.findOneByOrFail({ project, name })

  // --- Soft remove the variable.
  await WorkspaceProjectVariable.softRemove(variable)
}
