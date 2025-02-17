import type { CipherGCMTypes } from 'node:crypto'
import type { ModuleVault, VaultVariable } from '..'
import type { Encrypted } from '../utils'
import type { VaultAdapter } from './createVaultAdapter'
import { decrypt, encrypt } from '../utils'
import { createVaultAdapter } from './createVaultAdapter'

export interface VaultLocalOptions {

  /**
   * The GCM encryption algorithm to use for encrypting values. It must be one of
   * the following values: `aes-256-gcm`, `aes-128-gcm`, or `aes-192-gcm` to ensure
   * we use authenticated encryption and verify the integrity of the encrypted data.
   */
  algorithm: CipherGCMTypes

  /**
   * The secret to use for encrypting and decrypting values. If not provided,
   * it will use the default secret provided by the environment variables or
   * the configuration.
   */
  secret: string
}

export function createVaultLocal(this: ModuleVault, options: VaultLocalOptions): VaultAdapter<Encrypted> {
  const { algorithm, secret } = options
  return createVaultAdapter({
    initialize: async(): Promise<void> => {
      const isGCM = ['aes-256-gcm', 'aes-128-gcm', 'aes-192-gcm'].includes(algorithm)
      if (!isGCM) throw this.errors.VAULT_ADAPTER_LOCAL_ENCRYPTION_ALGORITHM_NOT_SUPPORTED(algorithm)
      if (!secret) throw this.errors.VAULT_ADAPTER_LOCAL_ENCRYPTION_KEY_REQUIRED()
      return await Promise.resolve()
    },

    setValue: async(variable, value): Promise<Encrypted> => {
      const data = await encrypt(value, secret, algorithm)
      variable.data = data
      return data
    },

    getValue: async(variable: VaultVariable<Encrypted>): Promise<string> => {
      const { iv, tag, cipher, salt, algorithm } = variable.data
      return await decrypt({ iv, tag, cipher, salt, algorithm }, secret)
    },

    deleteValue(variable: VaultVariable<Encrypted>): Promise<void> {
      variable.data = { iv: '', tag: '', cipher: '', salt: '', algorithm }
      return Promise.resolve()
    },

    listValues(): Promise<string[]> {
      return Promise.resolve([])
    },
  })
}
