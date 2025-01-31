import type { Loose } from '@unshared/types'
import type { WorkspaceProjectVariable } from '../entities'
import type { ModuleWorkspace } from '../index'
import { toConstantCase } from '@unshared/string'
import { assertStringNotEmpty, assertStringUuid, createSchema } from '@unshared/validation'

export const CREATE_PROJECT_VARIABLE_OPTIONS = createSchema({

  /** The workspace to create the project in. */
  workspace: createSchema({ id: assertStringUuid, name: assertStringNotEmpty }),

  /** The project to create the variable for. */
  project: createSchema({ id: assertStringUuid, name: assertStringNotEmpty }),

  /** The name of the variable to create. */
  name: [assertStringNotEmpty, toConstantCase],

  /** The value of the variable to create. */
  value: assertStringNotEmpty,
})

/** The options to create the project variable with. */
export type CreateProjectVariableOptions = Loose<ReturnType<typeof CREATE_PROJECT_VARIABLE_OPTIONS>>

/**
 * Create a new variable for the project with the given name and value. The function
 * will create a new variable with the given name and value and assign the user to
 * the variable with the given permission level. The function will throw an error if
 * the variable already exists in the project.
 *
 * @param options The options to create the project variable with.
 * @returns The newly created variable value.
 */
export async function createProjectVariable(this: ModuleWorkspace, options: CreateProjectVariableOptions): Promise<WorkspaceProjectVariable> {
  const { WorkspaceProjectVariable } = this.getRepositories()
  const { workspace, project, name, value } = CREATE_PROJECT_VARIABLE_OPTIONS(options)

  // --- Assert the user has access to the workspace and the project.
  const variable = await WorkspaceProjectVariable.findOneBy({ project, name })
  if (variable) throw this.errors.PROJECT_VARIABLE_NAME_TAKEN(workspace.name, project.name, name)

  // --- Create and return the variable.
  return WorkspaceProjectVariable.create({ project, name, value })
}
