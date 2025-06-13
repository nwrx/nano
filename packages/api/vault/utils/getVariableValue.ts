import type { Loose } from '@unshared/types'
import type { ModuleVault } from '../index'
import { assert, createParser } from '@unshared/validation'
import { assertProject } from '../../project'
import { assertWorkspace } from '../../workspace'
import { getVariable } from './getVariable'
import { getVaultAdapter } from './getVaultAdapter'

/** The schema for the getVariableValue options. */
export const GET_VARIABLE_VALUE_OPTIONS_SCHEMA = createParser({
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
  const vaultAssignment = await VaultProjectAssignment.findOne({
    where: { project, vault: { name: vault }, permission: 'Use' },
    relations: { vault: true },
  })

  // --- Get the variable from the database
  if (!vaultAssignment) throw this.errors.VAULT_VARIABLE_NOT_FOUND(workspace.name, vault, name)
  if (!vaultAssignment.vault) throw new Error(`Failed to load vault assignment for ${vault}`)
  const variable = await getVariable.call(this, { workspace, vault: vaultAssignment.vault, name })

  // --- Get the adapter and retrieve the decrypted value
  const adapter = await getVaultAdapter.call(this, vaultAssignment.vault)
  await adapter.initialize()
  return adapter.getValue(variable)
}
