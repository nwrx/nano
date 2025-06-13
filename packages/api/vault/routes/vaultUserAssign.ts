import type { ModuleVault } from '..'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { assertVaultPermission, getVault, updateVaultUserPermissions } from '../utils'

export function vaultUserAssign(this: ModuleVault) {
  return createHttpRoute(
    {
      name: 'PUT /api/workspaces/:workspace/vaults/:vault/assignments/:username',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        vault: assert.stringNotEmpty,
        username: assert.stringNotEmpty,
      }),
      parseBody: createParser({
        permissions: assert.arrayOf(assertVaultPermission),
      }),
    },
    async({ event, parameters, body }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace and check read permission
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const vault = await getVault.call(this, { user, workspace, name: parameters.vault, permission: 'Owner' })
      const assignee = await moduleUser.getUser({ username: parameters.username })

      // --- Assign the permissions to the user.
      const assignments = await updateVaultUserPermissions.call(this, { user, assignee, vault, permissions: body.permissions })
      const { VaultAssignment } = this.getRepositories()
      await VaultAssignment.save(assignments)
    },
  )
}
