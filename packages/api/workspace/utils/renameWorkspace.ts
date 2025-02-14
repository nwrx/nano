import type { Loose } from '@unshared/types'
import type { ModuleWorkspace } from '..'
import type { Workspace } from '../entities'
import { assertStringNotEmpty, assertStringUuid, createSchema } from '@unshared/validation'

/** The parser function for the {@linkcode renameWorkspace} function. */
const RENAME_WORKSPACE_OPTIONS = createSchema({

  /** The ID of the workspace to rename. */
  id: assertStringUuid,

  /** The new name for the workspace. */
  name: assertStringNotEmpty,
})

/** The options to rename the workspace with. */
export type RenameWorkspaceOptions = Loose<ReturnType<typeof RENAME_WORKSPACE_OPTIONS>>

/**
 * Rename a workspace. The function will update the workspace's name in the database.
 * If a workspace with the new name already exists, an error will be thrown.
 *
 * @param options The options to rename the workspace with.
 * @returns The renamed workspace.
 * @throws {E_WORKSPACE_NOT_FOUND} If the workspace is not found.
 * @throws {E_WORKSPACE_NAME_TAKEN} If a workspace with the new name already exists.
 */
export async function renameWorkspace(this: ModuleWorkspace, options: RenameWorkspaceOptions): Promise<Workspace> {
  const { id, name } = RENAME_WORKSPACE_OPTIONS(options)
  const { Workspace } = this.getRepositories()

  // --- Check if another workspace with the new name exists
  const existing = await Workspace.findOneBy({ name })
  if (existing) throw this.errors.WORKSPACE_NAME_TAKEN(name)

  // --- Find the workspace to rename
  const workspace = await Workspace.findOneBy({ id })
  if (!workspace) throw this.errors.WORKSPACE_NOT_FOUND(name)

  // --- Update the workspace name
  workspace.name = name
  return await Workspace.save(workspace)
}
