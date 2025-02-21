import type { Loose } from '@unshared/types'
import type { Workspace } from '../entities'
import type { ModuleWorkspace } from '../index'
import { assert, createSchema } from '@unshared/validation'
import { In } from 'typeorm'
import { assertWorkspacePermission } from './assertWorkspacePermission'

/** The parser fuction for the {@linkcode getWorkspace} function. */
const GET_WORKSPACE_OPTIONS = createSchema({

  /** The `name` of the {@linkcode Workspace} to find. */
  name: assert.stringNotEmpty,

  /** The `User` responsible for the request. */
  user: [[assert.undefined], [createSchema({ id: assert.stringUuid })]],

  /** The permissions required to access the workspace. */
  permission: assertWorkspacePermission,
})

/** The options to resolve the workspace with. */
export type ResolveWorkspaceOptions = Loose<ReturnType<typeof GET_WORKSPACE_OPTIONS>>

/**
 * Resolve the {@linkcode Workspace} with the given name. The function will query the database
 * for the workspace with the given name and assert that the user has access to the
 * workspace. If the workspace is not found or the user does not have access to the
 * workspace, the function will throw an error.
 *
 * @param options The options to find the workspace with.
 * @returns The {@linkcode Workspace} with the given name.
 * @example await getWorkspace({ name: 'my-workspace', permission: 'Read' }) // Workspace { ... }
 */
export async function getWorkspace(this: ModuleWorkspace, options: ResolveWorkspaceOptions): Promise<Workspace> {
  const { name, user, permission } = GET_WORKSPACE_OPTIONS(options)

  // --- Get the workspace.
  const { Workspace } = this.getRepositories()
  const workspace = await Workspace.findOne({
    where: user
      ? [{ name, isPublic: true }, { name, assignments: { user, permission: In(['Owner', 'Read']) } }]
      : [{ name, isPublic: true }],
  })

  // --- Abort early if the workspace is not found.
  // --- Return early if the user has read access.
  if (!workspace) throw this.errors.WORKSPACE_NOT_FOUND(name)
  if (permission === 'Read') return workspace
  if (!user) throw this.errors.WORKSPACE_UNAUTHORIZED(name)

  // --- Assert that the user has an assignment that matches the permission.
  const { WorkspaceAssignment } = this.getRepositories()
  const assignments = await WorkspaceAssignment.countBy({ user, workspace, permission: In(['Owner', permission]) })
  if (assignments === 0) throw this.errors.WORKSPACE_UNAUTHORIZED(name)
  return workspace
}
