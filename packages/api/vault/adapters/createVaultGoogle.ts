/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable sonarjs/todo-tag */
import type { VaultAdapter } from './createVaultAdapter'
import { createVaultAdapter } from './createVaultAdapter'

export interface VaultGoogleOptions {

  /**
   * Google Cloud Project ID
   */
  projectId: string

  /**
   * Service account credentials JSON
   */
  credentials: string

  /**
   * Optional parent path for secrets
   */
  parent?: string
}

// TODO: Implement Google Secret Manager adapter
export function createKeyVaultGoogle(options: VaultGoogleOptions): VaultAdapter {
  return createVaultAdapter({
    async initialize() {
      // TODO: Implement Google Secret Manager initialization
    },

    async setValue(key, value) {
      // TODO: Implement Google Secret Manager set value
      throw new Error('Not implemented')
    },

    async getValue(key) {
      // TODO: Implement Google Secret Manager get value
      throw new Error('Not implemented')
    },

    async deleteValue(key) {
      // TODO: Implement Google Secret Manager delete value
      throw new Error('Not implemented')
    },

    async listValues() {
      // TODO: Implement Google Secret Manager list values
      throw new Error('Not implemented')
    },
  })
}
