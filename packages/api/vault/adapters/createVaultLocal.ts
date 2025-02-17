import type { CipherGCMTypes } from 'node:crypto'
import type { ModuleVault, VaultVariable } from '..'
import type { ValueEncrypted } from '../utils'
import type { VaultAdapter } from './createVaultAdapter'
import { valueDecrypt, valueEncrypt } from '../utils'
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

export function createVaultLocal(this: ModuleVault, options: VaultLocalOptions): VaultAdapter<ValueEncrypted> {
  const { algorithm, secret } = options
  return createVaultAdapter({
    initialize: async(): Promise<void> => {
      const isGCM = ['aes-256-gcm', 'aes-128-gcm', 'aes-192-gcm'].includes(algorithm)
      if (!isGCM) throw this.errors.VAULT_ADAPTER_LOCAL_ENCRYPTION_ALGORITHM_NOT_SUPPORTED(algorithm)
      if (!secret) throw this.errors.VAULT_ADAPTER_LOCAL_ENCRYPTION_KEY_REQUIRED()
      return await Promise.resolve()
    },

    setValue: async(variable, value): Promise<ValueEncrypted> => {
      variable.data = await valueEncrypt(value, secret, algorithm)
      return variable.data
    },

    getValue: async(variable: VaultVariable<ValueEncrypted>): Promise<string> => {
      const { iv, tag, cipher, salt, algorithm } = variable.data
      return await valueDecrypt({ iv, tag, cipher, salt, algorithm }, secret)
    },

    deleteValue(variable: VaultVariable<ValueEncrypted>): Promise<void> {
      variable.data = { iv: '', tag: '', cipher: '', salt: '', algorithm }
      return Promise.resolve()
    },

    listValues(): Promise<string[]> {
      return Promise.resolve([])
    },
  })
}
