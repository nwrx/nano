import type { Loose } from '@unshared/types'
import type { ModuleVault } from '../index'
import { assert, createSchema } from '@unshared/validation'
import { assertProject } from '../../project'
import { assertWorkspace } from '../../workspace'
import { getVaultAdapter } from './getVaultAdapter'

/** The schema for the getVariableValue options. */
export const GET_VARIABLE_VALUE_OPTIONS_SCHEMA = createSchema({
  workspace: assertWorkspace,
  project: assertProject,
  vault: assert.stringNotEmpty,
  name: assert.stringNotEmpty,
})

/** Options for getting a variable value */
export type GetVariableValueOptions = Loose<ReturnType<typeof GET_VARIABLE_VALUE_OPTIONS_SCHEMA>>

/**
 * Gets the decrypted value of a variable from a vault.
 *
 * @param options The options for getting the variable value
 * @returns The decrypted value of the variable
 * @throws If the variable does not exist
 * @example await getVariableValue({ vault, name: 'MY_SECRET' }) // 'my-secret-value'
 */
export async function getVariableValue(this: ModuleVault, options: GetVariableValueOptions): Promise<string> {
  const { workspace, project, vault, name } = GET_VARIABLE_VALUE_OPTIONS_SCHEMA(options)

  // --- Assert that the project can `Use` the vault.
  const { VaultProjectAssignment } = this.getRepositories()
  const count = await VaultProjectAssignment.countBy({ project, vault: { name: vault }, permission: 'Use' })
  if (count === 0) throw this.errors.VAULT_VARIABLE_NOT_FOUND(workspace.name, vault, name)

  // --- Get the variable from the database
  const { VaultVariable } = this.getRepositories()
  const variable = await VaultVariable.findOne({ where: { vault: { name: vault }, name }, relations: { vault: true } })
  if (!variable) throw this.errors.VAULT_VARIABLE_NOT_FOUND(workspace.name, vault, name)

  // --- Get the adapter and retrieve the decrypted value
  const adapter = await getVaultAdapter.call(this, variable.vault!)
  await adapter.initialize()
  return adapter.getValue(variable)
}
