import type { Loose } from '@unshared/types'
import type { ModuleWorkspace } from '..'
import type { Workspace } from '../entities'
import { assertBoolean, assertStringNotEmpty, assertStringUuid, assertUndefined, createSchema } from '@unshared/validation'

/** The parser function for the {@linkcode createWorkspace} function. */
const CREATE_WORKSPACE_OPTIONS = createSchema({

  /** The name of the workspace to create. */
  name: assertStringNotEmpty,

  /** The `User` that will own the workspace. */
  user: createSchema({ id: assertStringUuid }),

  /** Whether the workspace is public or private. */
  isPublic: [[assertUndefined], [assertBoolean]],
})

/** The options to create the workspace with. */
export type CreateWorkspaceOptions = Loose<ReturnType<typeof CREATE_WORKSPACE_OPTIONS>>

/**
 * Create a new workspace with the given name and title. The function will create a new
 * workspace with the given name and title and assign the user to the workspace with full
 * access. The function will throw an error if the workspace already exists.
 *
 * @param options The options to create the workspace with.
 * @returns The newly created `Workspace` entity.
 */
export async function createWorkspace(this: ModuleWorkspace, options: CreateWorkspaceOptions): Promise<Workspace> {
  const { Workspace, WorkspaceAssignment } = this.getRepositories()
  const { user, name, isPublic = false } = CREATE_WORKSPACE_OPTIONS(options)

  // --- Assert the user does not already have a workspace with the same name.
  const exists = await Workspace.findOneBy({ name })
  if (exists) throw this.errors.WORKSPACE_NAME_TAKEN(name)

  // --- Create, assign, and save the workspace.
  const assignment = WorkspaceAssignment.create({ user, permission: 'Owner' })
  return Workspace.create({ name, isPublic, assignments: [assignment] })
}
