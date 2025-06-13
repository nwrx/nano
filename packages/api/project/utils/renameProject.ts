import type { Project } from '../entities'
import type { ModuleProject } from '../index'
import { toSlug } from '@unshared/string'
import { assert, createParser } from '@unshared/validation'
import { assertWorkspace } from '../../workspace'
import { assertProject } from './assertProject'

const SET_PROJECT_NAME_OPTIONS = createParser({
  workspace: assertWorkspace,
  project: assertProject,
  name: [assert.stringNotEmpty, toSlug],
})

export type SetProjectNameOptions = Parameters<typeof SET_PROJECT_NAME_OPTIONS>[0]

/**
 * Set the name of a project. This function will check if the new name is available
 * in the workspace and update the project's name.
 *
 * @param options The options to set the project name with.
 * @returns The project entity with updated name.
 */
export async function renameProject(this: ModuleProject, options: SetProjectNameOptions): Promise<Project> {
  const { project, name, workspace } = SET_PROJECT_NAME_OPTIONS(options)

  // --- Check if the new name is already taken
  const { Project } = this.getRepositories()
  const exists = await Project.countBy({ name, workspace })
  if (exists > 0) throw this.errors.PROJECT_NAME_TAKEN(workspace.name, name)

  // --- Update the project name
  project.name = name
  return project
}
