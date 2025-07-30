import type { ModuleProject } from '../index'
import { createParser } from '@unshared/validation'
import { assertUser } from '../../user'
import { assertWorkspace, ModuleWorkspace } from '../../workspace'
import { assertProject } from './assertProject'
import { getProjectEventBus } from './getProjectEventBus'

const REMOVE_PROJECT_OPTIONS_SCHEMA = createParser({
  workspace: assertWorkspace,
  project: assertProject,
  user: assertUser,
})

export type RemoveProjectOptions = ReturnType<typeof REMOVE_PROJECT_OPTIONS_SCHEMA>

/**
 * Remove a project from the workspace. This function will soft-delete the project
 * from the database and notify any listeners via the project event bus.
 *
 * @param options The options to remove the project with.
 * @returns The removed project entity.
 */
export async function removeProject(this: ModuleProject, options: RemoveProjectOptions): Promise<void> {
  const { workspace, project, user } = REMOVE_PROJECT_OPTIONS_SCHEMA(options)

  // --- Soft remove the project from the database
  const { Project } = this.getRepositories()
  project.deletedBy = user
  project.deletedAt = new Date()
  await Project.save(project)

  // --- Notify listeners via the event bus and close it.
  const eventData = { name: project.name, by: user.username }
  const eventBus = getProjectEventBus.call(this, { workspace, project })
  await eventBus?.sendMessage({ event: 'project.removed', data: eventData })
  await eventBus?.close()

  // --- Additionally, notify the workspace event bus if needed.
  const moduleWorkspace = this.getModule(ModuleWorkspace)
  const workspaceEventBus = moduleWorkspace.getEventBus({ workspace })
  await workspaceEventBus?.sendMessage({ event: 'workspace.project.removed', data: eventData })
}
