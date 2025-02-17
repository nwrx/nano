import type { Loose } from '@unshared/types'
import type { Project } from '../entities'
import type { ModuleProject } from '../index'
import { assertBoolean, assertString, assertStringNotEmpty, assertStringUuid, assertUndefined, createSchema } from '@unshared/validation'
import { ModuleWorkspace } from '../../workspace'

const CREATE_PROJECT_OPTIONS = createSchema({

  /** The name of the project to create. */
  name: assertStringNotEmpty,

  /** The workspace to create the project in. */
  workspace: assertStringNotEmpty,

  /** The title of the project to create. */
  title: [[assertUndefined], [assertString]],

  /** The description of the project to create. */
  description: [[assertUndefined], [assertString]],

  /** The `User` responsible for the request. */
  user: createSchema({ id: assertStringUuid }),

  /** Whether the project is public or private. */
  isPublic: [[assertUndefined], [assertBoolean]],
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
  const moduleWorkspace = this.getModule(ModuleWorkspace)
  const { Project, ProjectAssignment } = this.getRepositories()
  const { user, name, title = name, description, workspace: workspaceName, isPublic } = CREATE_PROJECT_OPTIONS(options)

  // --- Assert the user has access to the workspace and can create the project.
  const workspace = await moduleWorkspace.getWorkspace({ user, name: workspaceName, permission: 'Write' })

  // --- Check if the project already exists in the workspace.
  const exists = await Project.countBy({ name, workspace: { id: workspace.id } })
  if (exists > 0) throw this.errors.PROJECT_NAME_TAKEN(workspace.name, name)

  // --- Create the project and assign the user as the owner.
  const assignment = ProjectAssignment.create({ user, permission: 'Owner' })
  const project = Project.create({ name, title, description, workspace, isPublic, assignments: [assignment] })
  return await Project.save(project)
}
