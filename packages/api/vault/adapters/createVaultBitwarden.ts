/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable sonarjs/todo-tag */
import type { VaultAdapter } from './createVaultAdapter'
import { createVaultAdapter } from './createVaultAdapter'

export interface VaultBitwardenOptions {

  /**
   * Bitwarden API URL
   */
  apiUrl: string

  /**
   * Bitwarden client ID
   */
  clientId: string

  /**
   * Bitwarden client secret
   */
  clientSecret: string

  /**
   * Optional organization ID
   */
  organizationId?: string
}

// TODO: Implement Bitwarden adapter
export function createKeyVaultBitwarden(options: VaultBitwardenOptions): VaultAdapter {
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
