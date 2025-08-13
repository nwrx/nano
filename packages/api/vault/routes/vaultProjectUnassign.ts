import type { ModuleVault } from '..'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleProject } from '../../project'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getVault, updateVaultProjectPermissions } from '../utils'

export function vaultProjectUnassign(this: ModuleVault) {
  return createHttpRoute(
    {
      name: 'DELETE /workspaces/:workspace/vaults/:vault/projects/:project',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        vault: assert.stringNotEmpty,
        project: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleProject = this.getModule(ModuleProject)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace and check read permission
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const project = await moduleProject.getProject({ user, workspace, name: parameters.project, permission: 'Owner' })
      const vault = await getVault.call(this, { user, workspace, name: parameters.vault, permission: 'Owner' })

      // --- Unassign the project from the vault.
      const assignments = await updateVaultProjectPermissions.call(this, { user, project, vault, permissions: [] })
      const { VaultProjectAssignment } = this.getRepositories()
      await VaultProjectAssignment.save(assignments)
    },
  )
}
