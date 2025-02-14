import type { Loose } from '@unshared/types'
import type { FindOptionsWhere } from 'typeorm'
import type { Workspace } from '../entities'
import type { ModuleWorkspace } from '../index'
import { assertStringNotEmpty, assertStringUuid, assertUndefined, createSchema } from '@unshared/validation'
import { In } from 'typeorm'
import { assertWorkspacePermission } from './assertWorkspacePermission'

/** The parser fuction for the {@linkcode getWorkspace} function. */
const GET_WORKSPACE_OPTIONS = createSchema({

  /** The `name` of the {@linkcode Workspace} to find. */
  name: assertStringNotEmpty,

  /** The `User` responsible for the request. */
  user: [[assertUndefined], [createSchema({ id: assertStringUuid })]],

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
  const { Workspace } = this.getRepositories()
  const where: Array<FindOptionsWhere<Workspace>> = []

  // --- Abort early if the user is not authenticated and the permission is not 'Read'.
  if (!user && permission !== 'Read')
    throw this.errors.WORKSPACE_ACTION_NOT_AUTHORIZED(name)

  // --- If the request permission is 'Read', allow user-accessible workspaces to be retrieved.
  // --- In our context, any permission on a workspace implicitly grants 'Read' access.
  if (permission === 'Read') {
    where.push({ name, isPublic: true })
    if (user) where.push({ name, assignments: { user } })
  }

  // --- For any other permission, the user must have a matching permission
  // --- to the workspace itself or be an owner of the workspace.
  else if (user) {
    where.push({
      name,
      assignments: { user, permission: In(['Owner', permission]) },
    })
  }

  // --- Now that we have the where clause, we can query the database for the workspace.
  const result = await Workspace.findOne({ where })
  if (result) return result

  // --- If the workspace was not found, it means that there wasn't any workspace
  // --- that matched the assignments and private/public criterias. We don't
  // --- know if it was because the workspace didn't exist or if the user was not
  // --- authorized to access it and we don't want to know it.
  throw permission === 'Read'
    ? this.errors.WORKSPACE_NOT_FOUND(name)
    : this.errors.WORKSPACE_ACTION_NOT_AUTHORIZED(name)
}
