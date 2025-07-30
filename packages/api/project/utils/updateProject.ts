import type { ModuleProject } from '../index'
import { assert, createParser } from '@unshared/validation'
import { assertWorkspace, ModuleWorkspace } from '../../workspace'
import { assertProject } from './assertProject'
import { getProjectEventBus } from './getProjectEventBus'

const UPDATE_PROJECT_OPTIONS_SCHEMA = createParser({
  workspace: assertWorkspace,
  project: assertProject,
  title: [[assert.undefined], [assert.string]],
  description: [[assert.undefined], [assert.string]],
})

export type UpdateProjectOptions = ReturnType<typeof UPDATE_PROJECT_OPTIONS_SCHEMA>

/**
 * Update the project with the given options.
 *
 * @param options The options to update the project with.
 * @returns The updated project entity.
 */
export async function updateProject(this: ModuleProject, options: UpdateProjectOptions): Promise<void> {
  const { project, workspace, title, description } = UPDATE_PROJECT_OPTIONS_SCHEMA(options)

  // --- Update the project properties
  if (title !== undefined) project.title = title
  if (description !== undefined) project.description = description

  // --- Save the updated project
  const { Project } = this.getRepositories()
  await Project.save(project)

  // --- Notify listeners via the event bus.
  const eventData = Project.create(project).serialize({ withUpdatedBy: true })
  const eventBus = getProjectEventBus.call(this, { workspace, project })
  await eventBus?.sendMessage({ event: 'project.updated', data: eventData })

  // --- Notify the workspace event bus about the project update.
  const moduleWorkspace = this.getModule(ModuleWorkspace)
  const workspaceEventBus = moduleWorkspace.getEventBus({ workspace })
  await workspaceEventBus?.sendMessage({ event: 'workspace.project.updated', data: eventData })
}
