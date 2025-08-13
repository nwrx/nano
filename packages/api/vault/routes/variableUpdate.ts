import type { ModuleVault } from '..'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getVault, updateVariable } from '../utils'

export function variableUpdate(this: ModuleVault) {
  return createHttpRoute(
    {
      name: 'PUT /workspaces/:workspace/vaults/:vault/variables/:variable',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        vault: assert.stringNotEmpty,
        variable: assert.stringNotEmpty,
      }),
      parseBody: createParser({
        value: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters, body }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { VaultVariable } = this.getRepositories()
      const { user } = await moduleUser.authenticate(event)
      const { value } = body

      // --- Get the workspace and vault with write permission
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const vault = await getVault.call(this, { user, workspace, name: parameters.vault, permission: 'Write' })

      // --- Get the variable and update it
      const variable = await updateVariable.call(this, { user, workspace, vault, name: parameters.variable, value })
      await VaultVariable.save(variable)
    },
  )
}
