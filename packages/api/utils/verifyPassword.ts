import type { Password } from './createPassword'
import { createPassword } from './createPassword'

/**
 * Check if the provided password matches the stored hash using the same
 * options used to create the hash.
 *
 * @param password The clear text password to check.
 * @param hashValue The stored hash to compare against.
 * @returns True if the password matches the hash, false otherwise.
 * @example await verifyPassword('password', storedHash) // => true | false
 */
export async function verifyPassword(password: string, hashValue: Password): Promise<boolean> {
  const { hash: storedHash, salt, ...options } = hashValue
  const { hash: computedHash } = await createPassword({ password, salt, ...options })
  return computedHash === storedHash
}
