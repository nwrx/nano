import type { Loose } from '@unshared/types'
import type { Project } from '../entities'
import type { ModuleProject } from '../index'
import { toSlug } from '@unshared/string/toSlug'
import { assert, createParser } from '@unshared/validation'
import { assertUser } from '../../user'
import { assertWorkspace, ModuleWorkspace } from '../../workspace'

const CREATE_PROJECT_OPTIONS = createParser({
  workspace: assertWorkspace,
  user: assertUser,
  name: assert.stringNotEmpty,
  isPublic: [[assert.undefined], [assert.boolean]],
})

/** The options to create the project with. */
export type CreateProjectOptions = Loose<ReturnType<typeof CREATE_PROJECT_OPTIONS>>

/**
 * Create a new project in the workspace with the given name and title. The function
 * will create a new project with the given name and title and assign the user to
 * the project with full access. The function will throw an error if the project
 * already exists in the workspace.
 *
 * @param options The options to create the project with.
 * @returns The newly created `Project` entity.
 */
export async function createProject(this: ModuleProject, options: CreateProjectOptions): Promise<Project> {
  const { Project, ProjectAssignment } = this.getRepositories()
  const { user, name, workspace, isPublic } = CREATE_PROJECT_OPTIONS(options)

  // --- Check if the project already exists in the workspace.
  const exists = await Project.countBy({ name, workspace })
  if (exists > 0) throw this.errors.PROJECT_NAME_TAKEN(workspace.name, name)

  // --- Create the project and assign the user as the owner.
  const assignment = ProjectAssignment.create({ user, permission: 'Owner' })
  const project = Project.create({ name: toSlug(name), workspace, isPublic, createdBy: user, assignments: [assignment] })

  // --- Notify the workspace event bus about the new project.
  const moduleWorkspace = this.getModule(ModuleWorkspace)
  const eventBus = moduleWorkspace.getEventBus({ workspace })
  await eventBus?.sendMessage({
    event: 'workspace.project.created',
    data: project.serialize({ withCreatedBy: true }),
  })

  // --- Save and return the new project.
  return Project.save(project)
}
