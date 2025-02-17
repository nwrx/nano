import type { ValueEncrypted } from './valueEncrypt'
import { createDecipheriv, scrypt } from 'node:crypto'

/**
 * Decrypt a value using the provided secret.
 *
 * @param encrypted The encrypted value object.
 * @param secret The secret to use for decryption.
 * @returns The decrypted value.
 * @example await valueDecipher({ cipher: '...', ... }, 'my-secret-key') // 'my-secret-value'
 */
export async function valueDecrypt(encrypted: ValueEncrypted, secret: string): Promise<string> {

  // --- Ensure the algorithm is GCM.
  const isGCM = ['aes-256-gcm', 'aes-128-gcm', 'aes-192-gcm'].includes(encrypted.algorithm)
  if (!isGCM) throw new Error('The algorithm is not supported')

  // --- Compute the key length based on the algorithm.
  let keyLength = 32
  if (encrypted.algorithm === 'aes-192-gcm') keyLength = 24
  if (encrypted.algorithm === 'aes-128-gcm') keyLength = 16

  // --- Decode the iv, salt, and tag from base64.
  const iv = Buffer.from(encrypted.iv, 'base64')
  const salt = Buffer.from(encrypted.salt, 'base64')
  const key = await new Promise<Buffer>((resolve, reject) => {
    scrypt(secret, salt, keyLength, (error, key) => {
      if (error) return reject(error)
      resolve(key)
    })
  })

  const tag = Buffer.from(encrypted.tag, 'base64')
  const decipher = createDecipheriv(encrypted.algorithm, key, iv)
  decipher.setAuthTag(tag)
  const d1 = decipher.update(encrypted.cipher, 'base64', 'utf8')
  const d2 = decipher.final('utf8')
  return d1 + d2
}
