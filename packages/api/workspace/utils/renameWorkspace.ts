import type { Workspace } from '../entities'
import type { ModuleWorkspace } from '../index'
import { toSlug } from '@unshared/string'
import { assert, createParser } from '@unshared/validation'
import { assertWorkspace } from './assertWorkspace'

const RENAME_WORKSPACE_OPTIONS = createParser({
  workspace: assertWorkspace,
  name: [assert.stringNotEmpty, toSlug],
})

export type RenameWorkspaceOptions = Parameters<typeof RENAME_WORKSPACE_OPTIONS>[0]

/**
 * Set the name of a workspace. This function will check if the new name is available
 * and update the workspace's name.
 *
 * @param options The options to set the workspace name with.
 * @returns The workspace entity with updated name.
 */
export async function renameWorkspace(this: ModuleWorkspace, options: RenameWorkspaceOptions): Promise<Workspace> {
  const { workspace, name } = RENAME_WORKSPACE_OPTIONS(options)

  // --- Check if the new name is already taken
  const { Workspace } = this.getRepositories()
  const exists = await Workspace.countBy({ name })
  if (exists > 0) throw this.errors.WORKSPACE_NAME_TAKEN(name)

  // --- Update the workspace name
  workspace.name = name
  return workspace
}
