import type { Encrypted } from './encrypt'
import { createDecipheriv, scrypt } from 'node:crypto'

/**
 * Decrypt a value using the provided secret.
 *
 * @param encrypted The encrypted value object.
 * @param secret The secret to use for decryption.
 * @returns The decrypted value.
 * @example await decrypt({ cipher: '...', ... }, 'my-secret-key') // 'my-secret-value'
 */
export async function decrypt<T>(encrypted: Encrypted<T>, secret: string): Promise<T> {

  // --- Ensure the algorithm is GCM.
  const isGCM = ['aes-256-gcm', 'aes-128-gcm', 'aes-192-gcm'].includes(encrypted.algorithm)
  if (!isGCM) throw new Error('The algorithm is not supported')

  // --- Compute the key length based on the algorithm.
  let keyLength = 32
  if (encrypted.algorithm === 'aes-192-gcm') keyLength = 24
  if (encrypted.algorithm === 'aes-128-gcm') keyLength = 16

  // --- Decode the iv, salt, and tag from hex.
  const iv = Buffer.from(encrypted.iv, 'hex')
  const salt = Buffer.from(encrypted.salt, 'hex')
  const key = await new Promise<Buffer>((resolve, reject) => {
    scrypt(secret, salt, keyLength, (error, key) => {
      if (error) return reject(error)
      resolve(key)
    })
  })

  const tag = Buffer.from(encrypted.tag, 'hex')
  const decipher = createDecipheriv(encrypted.algorithm, key, iv)
  decipher.setAuthTag(tag)
  const d1 = decipher.update(encrypted.cipher, 'hex', 'utf8')
  const d2 = decipher.final('utf8')
  const decrypted = d1 + d2

  // --- Attempt to parse JSON, otherwise return as string.
  try {
    return JSON.parse(decrypted) as T
  }
  catch {
    return decrypted as T
  }
}
