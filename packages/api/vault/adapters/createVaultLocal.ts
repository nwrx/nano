import type { CipherGCMTypes } from 'node:crypto'
import type { ModuleVault, VaultVariable } from '..'
import type { VaultAdapter } from './createVaultAdapter'
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'node:crypto'
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

export interface VaultLocalData {

  /** The initialization vector used for encryption */
  iv: string

  /** The authentication tag used to verify the integrity of the encrypted data */
  tag: string

  /** The encrypted value */
  cipher: string

  /** The salt used for key derivation */
  salt: string

  /** The algorithm used when encrypting the value */
  algorithm: CipherGCMTypes
}

export function createVaultLocal(this: ModuleVault, options: VaultLocalOptions): VaultAdapter<VaultLocalData> {
  const { algorithm, secret } = options
  return createVaultAdapter({

    /**
     * Ensure a key is provided and that the algorithm is GCM.
     * We only support GCM because it provides authenticated encryption
     * and allows us to verify the integrity of the encrypted data.
     *
     * @returns A promise that resolves when the adapter is initialized.
     */
    initialize: async(): Promise<void> => {
      const isGCM = ['aes-256-gcm', 'aes-128-gcm', 'aes-192-gcm'].includes(algorithm)
      if (!isGCM) throw this.errors.VAULT_ADAPTER_LOCAL_ENCRYPTION_ALGORITHM_NOT_SUPPORTED(algorithm)
      if (!secret) throw this.errors.VAULT_ADAPTER_LOCAL_ENCRYPTION_KEY_REQUIRED()
      return await Promise.resolve()
    },

    /**
     * Encrypt the value using the secret and the algorithm provided.
     * The value is encrypted using the GCM mode of operation to ensure
     * authenticated encryption and verify the integrity of the encrypted data.
     *
     * @param variable The variable to encrypt.
     * @param value The value to encrypt.
     * @returns The encrypted data.
     */
    setValue: async(variable, value): Promise<VaultLocalData> => {
      const iv = randomBytes(16)
      const salt = randomBytes(32)
      const key = await new Promise<Buffer>((resolve, reject) => {
        scrypt(secret, salt, 32, (error, key) => {
          if (error) return reject(error)
          resolve(key)
        })
      })

      // --- Create a cipher using the algorithm, key, and iv.
      const cipher = createCipheriv(algorithm, key, iv)
      const d1 = cipher.update(value, 'utf8', 'base64')
      const d2 = cipher.final('base64')
      variable.data = {
        iv: iv.toString('base64'),
        tag: cipher.getAuthTag().toString('base64'),
        salt: salt.toString('base64'),
        cipher: d1 + d2,
        algorithm,
      }

      // --- Return the encrypted data.
      return variable.data
    },

    /**
     * Decrypt the value using the secret and the algorithm provided.
     * The value is decrypted using the GCM mode of operation to ensure
     * authenticated encryption and verify the integrity of the encrypted data.
     *
     * @param variable The variable to decrypt.
     * @returns The decrypted value.
     */
    getValue: async(variable: VaultVariable<VaultLocalData>): Promise<string> => {

      // --- Get the raw buffer values for the iv, salt, and key.
      const iv = Buffer.from(variable.data.iv, 'base64')
      const salt = Buffer.from(variable.data.salt, 'base64')
      const key = await new Promise<Buffer>((resolve, reject) => {
        scrypt(secret, salt, 32, (error, key) => {
          if (error) return reject(error)
          resolve(key)
        })
      })

      // --- Create a decipher using the algorithm, key, and iv.
      const tag = Buffer.from(variable.data.tag, 'base64')
      const decipher = createDecipheriv(variable.data.algorithm, key, iv)
      decipher.setAuthTag(tag)
      const d1 = decipher.update(variable.data.cipher, 'base64', 'utf8')
      const d2 = decipher.final('utf8')
      return d1 + d2
    },

    deleteValue(variable: VaultVariable<VaultLocalData>): Promise<void> {
      variable.data = { iv: '', tag: '', cipher: '', salt: '', algorithm }
      return Promise.resolve()
    },

    listValues(): Promise<string[]> {
      return Promise.resolve([])
    },
  })
}
