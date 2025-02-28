import type { Loose } from '@unshared/types'
import type { ModuleVault } from '../index'
import { assert, createSchema } from '@unshared/validation'
import { assertVault } from './assertVault'
import { getVaultAdapter } from './getVaultAdapter'

/** The schema for the getVariableValue options. */
export const GET_VARIABLE_VALUE_OPTIONS_SCHEMA = createSchema({
  vault: assertVault,
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
  const { VaultVariable } = this.getRepositories()
  const { vault, name } = GET_VARIABLE_VALUE_OPTIONS_SCHEMA(options)

  // --- Get the variable from the database
  const variable = await VaultVariable.findOneBy({ vault: { id: vault.id }, name })
  if (!variable) throw this.errors.VAULT_VARIABLE_NOT_FOUND(name, vault.name)

  // --- Get the adapter and retrieve the decrypted value
  const adapter = await getVaultAdapter.call(this, vault)
  await adapter.initialize()
  return adapter.getValue(variable)
}
