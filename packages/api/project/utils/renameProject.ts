import type { ModuleProject } from '../index'
import { toSlug } from '@unshared/string'
import { assert, createParser } from '@unshared/validation'
import { assertUser } from '../../user'
import { assertWorkspace, ModuleWorkspace } from '../../workspace'
import { assertProject } from './assertProject'
import { getProjectEventBus } from './getProjectEventBus'

const RENAME_PROJECT_OPTIONS_SCHEMA = createParser({
  workspace: assertWorkspace,
  project: assertProject,
  user: assertUser,
  name: [assert.stringNotEmpty, toSlug],
})

export type RenameProjectOptions = ReturnType<typeof RENAME_PROJECT_OPTIONS_SCHEMA>

/**
 * Set the name of a project. This function will check if the new name is available
 * in the workspace and update the project's name.
 *
 * @param options The options to set the project name with.
 * @returns The project entity with updated name.
 */
export async function renameProject(this: ModuleProject, options: RenameProjectOptions): Promise<void> {
  const { workspace, project, user, name } = RENAME_PROJECT_OPTIONS_SCHEMA(options)

  // --- Check if the new name is already taken
  const { Project } = this.getRepositories()
  const exists = await Project.countBy({ name, workspace })
  if (exists > 0) throw this.errors.PROJECT_NAME_TAKEN(workspace.name, name)

  // --- Update the project name
  const oldName = project.name
  project.name = name
  project.updatedBy = user
  await Project.save(project)

  // --- Notify listeners via the event bus.
  const eventData = { name, oldName, by: user.username }
  const eventBus = getProjectEventBus.call(this, { workspace, project })
  await eventBus?.sendMessage({ event: 'project.renamed', data: eventData })

  // --- Notify the workspace event bus about the project rename.
  const moduleWorkspace = this.getModule(ModuleWorkspace)
  const workspaceEventBus = moduleWorkspace.getEventBus({ workspace })
  await workspaceEventBus?.sendMessage({
    event: 'workspace.project.renamed',
    data: eventData,
  })
}
