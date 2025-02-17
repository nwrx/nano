/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable sonarjs/todo-tag */
import type { VaultAdapter } from './createVaultAdapter'
import { createVaultAdapter } from './createVaultAdapter'

export interface VaultAzureOptions {

  /**
   * The name of the Azure Key Vault
   */
  vaultName: string

  /**
   * The Azure tenant ID
   */
  tenantId: string

  /**
   * The Azure client ID
   */
  clientId: string

  /**
   * The Azure client secret
   */
  clientSecret: string
}

// TODO: Implement Azure Key Vault adapter
export function createKeyVaultAzure(options: VaultAzureOptions): VaultAdapter {
  return createVaultAdapter({
    async initialize() {
      throw new Error('Not implemented')
    },

    async setValue(value) {
      throw new Error('Not implemented')
    },

    async getValue(key) {
      throw new Error('Not implemented')
    },

    async deleteValue(key) {
      throw new Error('Not implemented')
    },

    async listValues() {
      throw new Error('Not implemented')
    },
  })
}
