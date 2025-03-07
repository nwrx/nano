import type { ModuleVault } from '..'
import { createHttpRoute } from '@unserved/server'
import { assert, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getVault, updateVaultUserPermissions } from '../utils'

export function vaultUserUnassign(this: ModuleVault) {
  return createHttpRoute(
    {
      name: 'DELETE /api/workspaces/:workspace/vaults/:vault/assignments/:username',
      parseParameters: createSchema({
        workspace: assert.stringNotEmpty,
        vault: assert.stringNotEmpty,
        username: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace and check read permission
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const vault = await getVault.call(this, { user, workspace, name: parameters.vault, permission: 'Owner' })
      const assignee = await moduleUser.getUser({ username: parameters.username })

      // --- Unassign the user from the vault.
      const assignments = await updateVaultUserPermissions.call(this, { user, assignee, vault, permissions: [] })
      const { VaultAssignment } = this.getRepositories()
      await VaultAssignment.save(assignments)
    },
  )
}
