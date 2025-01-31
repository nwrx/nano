import type { Loose } from '@unshared/types'
import type { FindOptionsWhere } from 'typeorm'
import type { WorkspaceProject } from '../entities'
import type { ModuleWorkspace } from '../index'
import { assertStringNotEmpty, assertStringUuid, assertUndefined, createSchema } from '@unshared/validation'
import { In } from 'typeorm'
import { assertProjectPermission } from './assertProjectPermission'

/** The parser fuction for the {@linkcode resolveProject} function. */
const RESOLVE_PROJECT_OPTIONS = createSchema({

  /** The `name` of the `WorkspaceProject` to find. */
  name: assertStringNotEmpty,

  /** The `User` responsible for the request. */
  user: [[assertUndefined], [createSchema({ id: assertStringUuid })]],

  /** The `Workspace` to find the project in. */
  workspace: createSchema({ id: assertStringUuid, name: assertStringNotEmpty }),

  /** At least one permission required to access the project. */
  permission: assertProjectPermission,

})

/** The options to resolve the project with. */
export type ResolveWorkspaceProjectOptions = Loose<ReturnType<typeof RESOLVE_PROJECT_OPTIONS>>

/**
 * Resolve the `WorkspaceProject` with the given name. The function will query the database
 * for the project with the given name and assert that the user has access to the project.
 * If the project is not found or the user does not have access to the project, the function
 * will throw an error.
 *
 * @param options The options to find the project with.
 * @returns The `WorkspaceProject` with the given name.
 */
export async function resolveProject(this: ModuleWorkspace, options: ResolveWorkspaceProjectOptions): Promise<WorkspaceProject> {
  const { name, workspace, user, permission } = RESOLVE_PROJECT_OPTIONS(options)
  const where: Array<FindOptionsWhere<WorkspaceProject>> = []
  const { WorkspaceProject, WorkspaceAssignment } = this.getRepositories()

  // --- If the user is the owner of the workspace, bypass assignment checks.
  const isOwner = await WorkspaceAssignment.findOneBy({ user, workspace, permission: 'Owner' })
  if (isOwner) {
    const workspaceProject = await WorkspaceProject.findOneBy({ name, workspace })
    if (!workspaceProject) throw this.errors.PROJECT_NOT_FOUND(workspace.name, name)
    return workspaceProject
  }

  // --- If a user is provided, find the project by the user's assignments.
  if (user) where.push({ name, workspace, assignments: { user, permission: In(['Owner', permission]) } })

  // --- If the permission is 'Read', allow resolving public projects.
  if (permission === 'Read') where.push({ name, workspace, isPublic: true })

  // --- If no where clause is provided, abort early.
  if (where.length === 0) {
    throw permission === 'Read'
      ? this.errors.PROJECT_NOT_FOUND(workspace.name, name)
      : this.errors.PROJECT_UNAUTHORIZED(workspace.name, name)
  }

  // --- If the project is not found, throw an error.
  const workspaceProject = await WorkspaceProject.findOne({ where, select: { id: true } })
  if (!workspaceProject) {
    throw permission === 'Read'
      ? this.errors.PROJECT_NOT_FOUND(workspace.name, name)
      : this.errors.PROJECT_UNAUTHORIZED(workspace.name, name)
  }

  // --- Return the resolved project.
  return workspaceProject
}
