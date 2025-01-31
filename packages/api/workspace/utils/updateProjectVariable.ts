import type { Loose } from '@unshared/types'
import type { ModuleWorkspace } from '..'
import { assertStringNotEmpty, assertStringUuid, assertUndefined, createSchema } from '@unshared/validation'

/** A parser for the update project variable options. */
export const UPDATE_PROJECT_VARIABLE_OPTIONS = createSchema({

  /** The user responsible for updating the project variable. */
  user: [[assertUndefined], [createSchema({ id: assertStringUuid })]],

  /** The workspace to update the project in. */
  workspace: assertStringNotEmpty,

  /** The project to update the variable for. */
  project: assertStringNotEmpty,

  /** The name of the variable to update. */
  name: assertStringNotEmpty,

  /** The new value of the variable to update. */
  value: assertStringNotEmpty,
})

/** The options to update the project variable with. */
export type UpdateProjectVariableOptions = Loose<ReturnType<typeof UPDATE_PROJECT_VARIABLE_OPTIONS>>

/**
 * Update the variable for the project with the given name. The function will update
 * the variable with the given name and value and assign the user to the variable with
 * the given permission level. The function will throw an error if the variable does not
 * exist in the project.
 *
 * @param options The options to update the project variable with.
 * @returns The updated variable value.
 */
export async function updateProjectVariable(this: ModuleWorkspace, options: UpdateProjectVariableOptions): Promise<void> {
  const { WorkspaceProjectVariable } = this.getRepositories()
  const { user, workspace: workspaceName, project: projectName, name, value } = UPDATE_PROJECT_VARIABLE_OPTIONS(options)

  // --- Resolve the workspace and project and check if the user can update the variable.
  const workspace = await this.resolveWorkspace({ user, name: workspaceName, permission: 'Read' })
  const project = await this.resolveProject({ workspace, name: projectName, permission: 'WriteVariables' })
  const variable = await WorkspaceProjectVariable.findOneByOrFail({ project, name })

  // --- Update and return the variable.
  variable.value = value
  await WorkspaceProjectVariable.save(variable)
}
