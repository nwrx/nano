import type { ModuleVault } from '..'
import type { Encrypted } from '../../utils'
import type { VaultAdapter, VaultAwsOptions, VaultAzureOptions, VaultHashicorpOptions, VaultLocalOptions } from '../adapters'
import type { Vault } from '../entities'
import type { VaultType } from './assertVaultType'
import { decrypt } from '../../utils'
import { createVaultHashicorp, createVaultLocal } from '../adapters'

export type VaultConfiguration<T extends VaultType = VaultType> =
  T extends 'aws' ? VaultAwsOptions
    : T extends 'azure' ? VaultAzureOptions
      : T extends 'hashicorp' ? VaultHashicorpOptions
        : T extends 'local' ? VaultLocalOptions
          : Record<string, unknown>

/**
 * Get a vault adapter based on the vault type and configuration.
 *
 * @param vault The vault to get the adapter for.
 * @returns The adapter used to interact with the vault.
 * @example
 *
 * // Get the vault entity.
 * const vault = await moduleVault.getVault({ name: 'my-vault', workspace: 'my-workspace' })
 *
 * // Get the vault adapter.
 * const adapter = await moduleVault.getVaultAdapter(vault)
 */
export async function getVaultAdapter(this: ModuleVault, vault: Pick<Vault, 'configuration' | 'type'>): Promise<VaultAdapter> {

  // if (vault.type === VaultType.AWS) {
  //   const configurationJson = await valueDecrypt(vault.configuration, this.vaultConfigurationSecretKey)
  //   const configuration = JSON.parse(configurationJson) as VaultAwsOptions
  //   return createVaultAws(configuration) as unknown as VaultAdapter
  // }

  // if (vault.type === VaultType.Azure) {
  //   const configurationJson = await valueDecrypt(vault.configuration, this.vaultConfigurationSecretKey)
  //   const configuration = JSON.parse(configurationJson) as VaultAzureOptions
  //   return createVaultAzure(configuration) as unknown as VaultAdapter
  // }

  if (vault.type === 'hashicorp') {
    const configurationJson = await decrypt(vault.configuration, this.vaultConfigurationSecretKey)
    const configuration = JSON.parse(configurationJson) as VaultHashicorpOptions
    return createVaultHashicorp(configuration)
  }

  if (vault.type === 'local') {
    const configurationJson = await decrypt(vault.configuration, this.vaultConfigurationSecretKey)
    const configuration = JSON.parse(configurationJson) as VaultLocalOptions
    return createVaultLocal.call(this, configuration) as unknown as VaultAdapter<Encrypted>
  }

  throw this.errors.VAULT_ACTION_NOT_ALLOWED(vault.type)
}
