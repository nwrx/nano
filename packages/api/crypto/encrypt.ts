import type { CipherGCMTypes } from 'node:crypto'
import { createCipheriv, randomBytes, scrypt } from 'node:crypto'

export const SYMBOL_TYPE_ENCRYPTED = Symbol.for('Encrypted')

export interface Encrypted<T = string> {
  [SYMBOL_TYPE_ENCRYPTED]: T
  iv: string
  tag: string
  salt: string
  cipher: string
  algorithm: CipherGCMTypes
}

/**
 * Encrypt a value using the provided secret and algorithm.
 *
 * @param value The value to cipher.
 * @param secret The secret to use for encryption.
 * @param algorithm The algorithm to use for encryption.
 * @returns An object containing cipher as well as the iv, tag, salt, and algorithm used.
 * @example await encrypt('my-secret-value', 'my-secret-key', 'aes-256-gcm') // { cipher: '...', ... }
 */
export async function encrypt<T extends object | string>(
  value: T,
  secret: string,
  algorithm: CipherGCMTypes,
): Promise<Encrypted<T>> {

  // --- Ensure the algorithm is GCM.
  const isGCM = ['aes-256-gcm', 'aes-128-gcm', 'aes-192-gcm'].includes(algorithm)
  if (!isGCM) throw new Error('The algorithm is not supported')

  // --- Compute the key length based on the algorithm.
  let keyLength = 32
  if (algorithm === 'aes-192-gcm') keyLength = 24
  if (algorithm === 'aes-128-gcm') keyLength = 16

  // --- Generate a random initialization vector and salt.
  const iv = randomBytes(16)
  const salt = randomBytes(32)
  const key = await new Promise<Buffer>((resolve, reject) => {
    scrypt(secret, salt, keyLength, (error, key) => {
      if (error) return reject(error)
      resolve(key)
    })
  })

  // --- Create a cipher using the algorithm, key, and iv.
  // --- If value is an object, stringify it.
  const valueString = typeof value === 'string' ? value : JSON.stringify(value)
  const cipher = createCipheriv(algorithm, key, iv)
  const d1 = cipher.update(valueString, 'utf8', 'hex')
  const d2 = cipher.final('hex')
  return {
    iv: iv.toString('hex'),
    tag: cipher.getAuthTag().toString('hex'),
    salt: salt.toString('hex'),
    cipher: d1 + d2,
    algorithm,
  } as Encrypted<T>
}
