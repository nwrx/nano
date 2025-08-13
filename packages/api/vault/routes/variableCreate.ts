import type { ModuleVault } from '..'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { setResponseStatus } from 'h3'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { createVariable, getVault } from '../utils'

export function variableCreate(this: ModuleVault) {
  return createHttpRoute(
    {
      name: 'POST /workspaces/:workspace/vaults/:vault/variables',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        vault: assert.stringNotEmpty,
      }),
      parseBody: createParser({
        name: assert.stringNotEmpty,
        value: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters, body }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { VaultVariable } = this.getRepositories()
      const { user } = await moduleUser.authenticate(event)
      const { name, value } = body

      // --- Get the workspace and vault with write permission
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const vault = await getVault.call(this, { user, workspace, name: parameters.vault, permission: 'Write' })

      // --- Create the variable and save it
      const variable = await createVariable.call(this, { user, vault, name, value })
      await VaultVariable.save(variable)
      setResponseStatus(event, 201)
    },
  )
}
