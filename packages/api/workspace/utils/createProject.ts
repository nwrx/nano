import type { Loose } from '@unshared/types'
import type { WorkspaceProject } from '../entities'
import type { ModuleWorkspace } from '../index'
import { assertBoolean, assertString, assertStringNotEmpty, assertStringUuid, assertUndefined, createSchema } from '@unshared/validation'

const CREATE_PROJECT_OPTIONS = createSchema({

  /** The name of the project to create. */
  name: assertStringNotEmpty,

  /** The title of the project to create. */
  title: [[assertUndefined], [assertString]],

  /** The description of the project to create. */
  description: [[assertUndefined], [assertString]],

  /** The `User` responsible for the request. */
  user: createSchema({ id: assertStringUuid }),

  /** The workspace to create the project in. */
  workspace: createSchema({ id: assertStringUuid, name: assertStringNotEmpty }),

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
 * @returns The newly created `WorkspaceProject` entity.
 */
export async function createProject(this: ModuleWorkspace, options: CreateProjectOptions): Promise<WorkspaceProject> {
  const { WorkspaceProject, WorkspaceProjectAssignment } = this.getRepositories()
  const { user, name, title = name, description, workspace, isPublic } = CREATE_PROJECT_OPTIONS(options)

  // --- Assert the user has access to the workspace and the project does not exist.
  const exists = await WorkspaceProject.findOneBy({ name, workspace })
  if (exists) throw this.errors.PROJECT_NAME_TAKEN(workspace.name, name)

  // --- Create the project and assign the user as the owner.
  const assignment = WorkspaceProjectAssignment.create({ user, permission: 'Owner' })
  return WorkspaceProject.create({ name, title, description, workspace, isPublic, assignments: [assignment] })
}
