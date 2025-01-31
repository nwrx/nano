import type { Loose } from '@unshared/types'
import type { FindOptionsWhere } from 'typeorm'
import type { Workspace } from '../entities'
import type { ModuleWorkspace } from '../index'
import { assertStringNotEmpty, assertStringUuid, assertUndefined, createSchema } from '@unshared/validation'
import { In } from 'typeorm'
import { assertWorkspacePermission } from './assertWorkspacePermission'

/** The parser fuction for the {@linkcode resolveWorkspace} function. */
const RESOLVE_WORKSPACE_OPTIONS = createSchema({

  /** The `name` of the `Workspace` to find. */
  name: assertStringNotEmpty,

  /** The `User` responsible for the request. */
  user: [[assertUndefined], [createSchema({ id: assertStringUuid })]],

  /** The permissions required to access the workspace. */
  permission: assertWorkspacePermission,
})

/** The options to resolve the workspace with. */
export type ResolveWorkspaceOptions = Loose<ReturnType<typeof RESOLVE_WORKSPACE_OPTIONS>>

/**
 * Resolve the `Workspace` with the given name. The function will query the database
 * for the workspace with the given name and assert that the user has access to the
 * workspace. If the workspace is not found or the user does not have access to the
 * workspace, the function will return `undefined`.
 *
 * @param options The options to find the workspace with.
 * @returns The `Workspace` with the given name.
 * @example await resolveWorkspace({ workspace: 'my-workspace' }) // Workspace { ... }
 */
export async function resolveWorkspace(this: ModuleWorkspace, options: ResolveWorkspaceOptions): Promise<Workspace> {
  const { name, user, permission } = RESOLVE_WORKSPACE_OPTIONS(options)
  const { Workspace } = this.getRepositories()
  const where: Array<FindOptionsWhere<Workspace>> = []

  // --- If the permission is 'Read', allow resolving public workspaces.
  if (permission === 'Read') where.push({ name, isPublic: true })

  // --- If a user is provided, find the workspace by the user's assignments.
  if (user) where.push({ name, assignments: { user, permission: In(['Owner', permission]) } })

  // --- If no where clause is provided, abort early.
  if (where.length === 0) {
    throw permission === 'Read'
      ? this.errors.WORKSPACE_NOT_FOUND(name)
      : this.errors.WORKSPACE_ACTION_NOT_AUTHORIZED(name)
  }

  // --- If the workspace is not found, throw an error.
  const result = await Workspace.findOne({ where, select: { id: true, name: true } })
  if (!result) {
    throw permission === 'Read'
      ? this.errors.WORKSPACE_NOT_FOUND(name)
      : this.errors.WORKSPACE_ACTION_NOT_AUTHORIZED(name)
  }

  // --- Return the resolved workspace.
  return result
}
