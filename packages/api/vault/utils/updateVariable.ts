import type { Loose } from '@unshared/types'
import type { ModuleVault } from '..'
import { assert, createSchema } from '@unshared/validation'
import { assertUser } from '../../user'
import { assertWorkspace } from '../../workspace'
import { assertVault } from './assertVault'
import { getVaultAdapter } from './getVaultAdapter'

export const UPDATE_VARIABLE_OPTIONS_SCHEMA = createSchema({
  user: assertUser,
  vault: assertVault,
  workspace: assertWorkspace,
  name: assert.stringNotEmpty,
  value: assert.stringNotEmpty,
})

/** The options for updating a variable. */
export type UpdateVariableOptions = Loose<ReturnType<typeof UPDATE_VARIABLE_OPTIONS_SCHEMA>>

/**
 * Updates the value of a variable in the given vault. This function will retrieve
 * the vault adapter for the given vault and use it to update the value of the variable.
 *
 * @param options The options for updating the variable.
 * @returns The updated variable entity.
 * @example
 *
 * // Get the vault entity.
 * const vault = await moduleVault.getVault({ ... })
 *
 * // Update the variable.
 * const variable = await moduleVault.updateVariable({ ..., vault })
 */
export async function updateVariable(this: ModuleVault, options: UpdateVariableOptions) {
  const { workspace, name, value, vault } = UPDATE_VARIABLE_OPTIONS_SCHEMA(options)

  // --- Get the variable entity and update the value.
  const { VaultVariable } = this.getRepositories()
  const variable = await VaultVariable.findOne({ where: { vault, name } })
  if (!variable) throw this.errors.VAULT_VARIABLE_NOT_FOUND(workspace.name, vault.name, name)

  // --- Update the value of the variable.
  const adapter = await getVaultAdapter.call(this, vault)
  await adapter.initialize()
  await adapter.setValue(variable, value)

  // --- Return the updated variable.
  return variable
}
