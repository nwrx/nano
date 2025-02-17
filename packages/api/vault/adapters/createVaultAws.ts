/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable sonarjs/todo-tag */
import type { VaultAdapter } from './createVaultAdapter'
import { createVaultAdapter } from './createVaultAdapter'

export interface VaultAwsOptions {

  /**
   * AWS region
   */
  region: string

  /**
   * AWS access key ID
   */
  accessKeyId: string

  /**
   * AWS secret access key
   */
  secretAccessKey: string

  /**
   * Optional AWS KMS key ID for encryption
   */
  kmsKeyId?: string
}

// TODO: Implement AWS Secrets Manager adapter
export function createVaultAws(options: VaultAwsOptions): VaultAdapter {
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
