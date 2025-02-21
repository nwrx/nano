import type { Loose } from '@unshared/types'
import type { Workspace } from '../entities'
import type { ModuleWorkspace } from '../index'
import { assert, createSchema } from '@unshared/validation'
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
    where: { name },
    relations: user ? { assignments: { user: true } } : undefined,
  })

  // --- Assert that the workspace exists. Quit early if the workspace is public.
  if (!workspace) throw this.errors.WORKSPACE_NOT_FOUND(name)
  if (!user && permission === 'Read' && workspace.isPublic) return workspace
  if (!user) {
    throw workspace.isPublic
      ? this.errors.WORKSPACE_ACTION_NOT_AUTHORIZED(name)
      : this.errors.WORKSPACE_NOT_FOUND(name)
  }

  // --- Assert that the user has the right permissions.
  let hasAccess = permission === 'Read' && workspace.isPublic
  let hasReadAccess = workspace.isPublic
  for (const assignment of workspace.assignments!) {
    if (assignment.user!.id !== user.id) continue
    if (assignment.permission === 'Owner') return workspace
    if (assignment.permission === 'Read') hasReadAccess = true
    if (assignment.permission === permission) hasAccess = true
  }

  if (!hasReadAccess) throw this.errors.WORKSPACE_NOT_FOUND(name)
  if (!hasAccess) throw this.errors.WORKSPACE_ACTION_NOT_AUTHORIZED(name)
  return workspace
}
