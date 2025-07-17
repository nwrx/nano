import type { Loose } from '@unshared/types'
import type { VaultVariable } from '../entities'
import type { ModuleVault } from '../index'
import { assert, createParser } from '@unshared/validation'
import { assertWorkspace } from '../../workspace'
import { assertVault } from '../utils/assertVault'

/** The schema for the getVariable options. */
export const GET_VARIABLE_OPTIONS_SCHEMA = createParser({
  workspace: assertWorkspace,
  vault: assertVault,
  name: assert.stringNotEmpty,
})

/** Options for getting a variable */
export type GetVariableOptions = Loose<ReturnType<typeof GET_VARIABLE_OPTIONS_SCHEMA>>

/**
 * Gets a variable entity from a vault. This function will check if the project
 * has permission to use the vault and return the variable entity if found.
 *
 * @param options The options for getting the variable
 * @returns The variable entity
 * @throws If the variable does not exist or the project doesn't have access
 * @example
 *
 * // Get a variable entity from a vault.
 * const variable = await moduleVault.getVariable({
 *   workspace,
 *   vault,
 *   name: 'MY_SECRET'
 * })
 */
export async function getVariable(this: ModuleVault, options: GetVariableOptions): Promise<VaultVariable> {
  const { workspace, vault, name } = GET_VARIABLE_OPTIONS_SCHEMA(options)
  const { VaultVariable } = this.getRepositories()
  const variable = await VaultVariable.findOneBy({ vault, name })
  if (!variable) throw this.errors.VAULT_VARIABLE_NOT_FOUND(workspace.name, vault.name, name)
  return variable
}
