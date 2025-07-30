import type { ModuleProject } from '../index'
import { assert, createParser } from '@unshared/validation'
import { ModuleIcon } from '../../icon'
import { assertWorkspace, ModuleWorkspace } from '../../workspace'
import { assertProject } from './assertProject'
import { getProjectEventBus } from './getProjectEventBus'

const UPDATE_PROJECT_OPTIONS_SCHEMA = createParser({
  workspace: assertWorkspace,
  project: assertProject,
  icon: [[assert.undefined], [assert.string]],
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
  const moduleIcon = this.getModule(ModuleIcon)
  const moduleWorkspace = this.getModule(ModuleWorkspace)
  const { project, workspace, title, icon, description } = UPDATE_PROJECT_OPTIONS_SCHEMA(options)

  // --- Update the project properties
  const { Project } = this.getRepositories()
  if (icon !== undefined) project.icon = await moduleIcon.getIcon({ name: icon })
  if (title !== undefined) project.title = title
  if (description !== undefined) project.description = description
  await Project.save(project)

  // --- Notify listeners via the event bus.
  const eventData = Project.create(project).serialize({ withUpdatedBy: true })
  const eventBus = getProjectEventBus.call(this, { workspace, project })
  await eventBus?.sendMessage({ event: 'project.updated', data: eventData })

  // --- Notify the workspace event bus about the project update.
  const workspaceEventBus = moduleWorkspace.getEventBus({ workspace })
  await workspaceEventBus?.sendMessage({ event: 'workspace.project.updated', data: eventData })
}
