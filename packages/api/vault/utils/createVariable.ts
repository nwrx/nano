import type { Loose } from '@unshared/types'
import type { ModuleVault } from '../index'
import { assert, createSchema } from '@unshared/validation'
import { assertUser } from '../../user'
import { assertVault } from './assertVault'
import { getVaultAdapter } from './getVaultAdapter'

export const CREATE_VARIABLE_OPTIONS_SCHEMA = createSchema({
  user: assertUser,
  vault: assertVault,
  name: assert.stringNotEmpty,
  value: assert.stringNotEmpty,
})

/** The options for creating a variable. */
export type CreateVariableOptions = Loose<ReturnType<typeof CREATE_VARIABLE_OPTIONS_SCHEMA>>

/**
 * Creates a new variable and store its value in the given vault. This function
 * will retrieve the vault adapter for the given vault and use it to store the
 * value of the variable.
 *
 * @param options The options for creating the variable.
 * @returns The created variable entity.
 * @example
 *
 * // Get the vault entity.
 * const vault = await moduleVault.getVault({ ... })
 *
 * // Create the variable.
 * const variable = await moduleVault.createVariable({ ..., vault })
 */
export async function createVariable(this: ModuleVault, options: CreateVariableOptions) {
  const { VaultVariable } = this.getRepositories()
  const { user, name, value, vault } = CREATE_VARIABLE_OPTIONS_SCHEMA(options)

  // --- Create the variable entity and apply the value to the vault.
  const variable = VaultVariable.create({ name, vault, createdBy: user })
  const adapter = await getVaultAdapter.call(this, vault)
  await adapter.initialize()
  await adapter.setValue(variable, value)

  // --- Return the created variable.
  return variable
}
