import type { Loose } from '@unshared/types'
import type { ModuleVault } from '../index'
import { assertStringNotEmpty, createSchema } from '@unshared/validation'
import { assertVault } from './assertVault'
import { getVaultAdapter } from './getVaultAdapter'

export const SET_VARIABLE_VALUE_OPTIONS_SCHEMA = createSchema({
  vault: assertVault,
  name: assertStringNotEmpty,
  value: assertStringNotEmpty,
})

/** Options for setting a variable value */
export type SetVariableValueOptions = Loose<ReturnType<typeof SET_VARIABLE_VALUE_OPTIONS_SCHEMA>>

/**
 * Updates the value of an existing variable in a vault.
 *
 * @param options The options for setting the variable value
 * @throws If the variable does not exist
 * @example await setVariableValue({ vault, name: 'MY_SECRET', value: 'new-secret' })
 */
export async function setVariableValue(this: ModuleVault, options: SetVariableValueOptions): Promise<void> {
  const { VaultVariable } = this.getRepositories()
  const { vault, name, value } = SET_VARIABLE_VALUE_OPTIONS_SCHEMA(options)

  // --- Get the variable from the database
  const variable = await VaultVariable.findOneBy({ vault: { id: vault.id }, name })
  if (!variable) throw this.errors.VAULT_VARIABLE_NOT_FOUND(name, vault.name)

  // --- Get the adapter and update the encrypted value
  const adapter = await getVaultAdapter.call(this, vault)
  await adapter.initialize()
  await adapter.setValue(variable, value)
  await VaultVariable.save(variable)
}
