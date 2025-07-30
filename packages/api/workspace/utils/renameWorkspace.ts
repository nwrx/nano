import type { ModuleWorkspace } from '../index'
import { toSlug } from '@unshared/string'
import { assert, createParser } from '@unshared/validation'
import { assertUser } from '../../user'
import { assertWorkspace } from './assertWorkspace'
import { getWorkspaceEventBus } from './getWorkspaceEventBus'

const RENAME_WORKSPACE_OPTIONS = createParser({
  user: assertUser,
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
export async function renameWorkspace(this: ModuleWorkspace, options: RenameWorkspaceOptions): Promise<void> {
  const { user, workspace, name } = RENAME_WORKSPACE_OPTIONS(options)

  // --- Check if the new name is already taken
  const { Workspace } = this.getRepositories()
  const exists = await Workspace.countBy({ name })
  if (exists > 0) throw this.errors.WORKSPACE_NAME_TAKEN(name)

  // --- Update the workspace name
  const oldName = workspace.name
  workspace.name = name
  workspace.updatedBy = user
  await Workspace.save(workspace)

  // --- Notify listeners via the event bus.
  const eventData = { name, oldName, by: user.username }
  const eventBus = getWorkspaceEventBus.call(this, { workspace })
  await eventBus?.sendMessage({ event: 'workspace.renamed', data: eventData })
}
