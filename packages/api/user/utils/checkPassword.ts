import type { ModuleUser } from '..'
import type { User } from '../entities'
import { scrypt } from 'node:crypto'

/**
 * Given a user and a password, check if the password matches the most recent password
 * hash stored in the database. It uses the same options used to hash the password to
 * compare the password with the stored hash.
 *
 * @param user The user to check the password for.
 * @param password The password to check.
 * @returns Whether the password matches the stored hash.
 */
export async function checkPassword(this: ModuleUser, user: User, password: string): Promise<boolean> {
  const { UserPassword } = this.getRepositories()

  // --- Find the most recent password associated with the user.
  const userPassword = await UserPassword.findOne({
    where: { user },
    order: { createdAt: 'DESC' },
  })

  // --- Return false if password is missing, expired, or invalid.
  if (!userPassword) return false
  if (userPassword.expiredAt && userPassword.expiredAt < new Date()) return false

  // --- Compute the hash of the given password.
  const { keylen, encoding, salt, ...hashOptions } = userPassword.options
  const hash = await new Promise<string>((resolve, reject) =>
    scrypt(password, salt, keylen, hashOptions, (error, derivedKey) => {
      if (error) reject(error)
      else resolve(derivedKey.toString(encoding))
    }))

  // --- Compare the hash of the given password with the stored hash.
  return hash === userPassword.hash
}
