import type { Loose } from '@unshared/types'
import type { ModuleVault } from '..'
import type { Vault } from '../entities'
import type { VaultConfiguration } from './getVaultAdapter'
import { assert, createParser } from '@unshared/validation'
import { assertUser } from '../../user'
import { encrypt } from '../../utils'
import { assertVault } from './assertVault'

const UPDATE_VAULT_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  vault: assertVault,
  configuration: assert.objectStrict as (value: unknown) => asserts value is VaultConfiguration,
})

/** The options for updating the vault configuration. */
export type UpdateVaultOptions = Loose<ReturnType<typeof UPDATE_VAULT_OPTIONS_SCHEMA>>

/**
 * Update the configuration of the vault with the given name in the workspace. The function will
 * throw an error if the vault does not exist in the workspace or if the user does not have write
 * permission on the vault.
 *
 * @param options The options for updating the vault configuration.
 * @returns The updated `Vault` entity.
 */
export async function updateVault(this: ModuleVault, options: UpdateVaultOptions): Promise<Vault> {
  const { user, vault, configuration } = UPDATE_VAULT_OPTIONS_SCHEMA(options)

  // --- Decrypt the configuration using the module's encryption key.
  const configurationEncrypted = await encrypt(
    JSON.stringify(configuration),
    this.encryptionSecret,
    this.encryptionAlgorithm,
  )

  // --- Update the configuration and save the vault.
  vault.configuration = configurationEncrypted
  vault.updatedAt = new Date()
  vault.updatedBy = user
  return vault
}
