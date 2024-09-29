import type { ScryptOptions } from 'node:crypto'
import type { User } from '../entities'
import type { ModuleUser } from '../index'
import { randomBytes, scrypt } from 'node:crypto'

/**
 * Options to hash the password of the user. It includes the length of the
 * hash that will be generated.
 */
export interface PasswordOptions extends ScryptOptions {

  /**
   * The user to create the password for. If provided, the password will be
   * associated with the user and can be used to authenticate the user.
   */
  user?: User

  /**
   * Length of the hash that will be generated. It is recommended to use
   * a length of 512 bits.
   *
   * @default 512
   */
  keylen: number

  /**
   * Encoding of the hash when stored in the database. It can be any
   * of the supported encodings by Node.js.
   *
   * @default 'hex'
   */
  encoding: BufferEncoding

  /**
   * The salt to hash the password. By default, a random salt is generated
   * but it can be provided to hash the password with a specific salt and
   * compare it with the stored hash.
   *
   * @default randomBytes(32).toString(encoding)
   */
  salt: string

  /**
   * The duration time in milliseconds for the password. If the password
   * duration from the creation time exceeds the duration, the password
   * is considered expired and cannot be used to authenticate the user.
   *
   * @default -1
   */
  duration?: number
}

/**
 * Create a password hash using the Scrypt algorithm. It generates a random
 * salt and hashes the password using the options provided. The default options
 * are provided by OWASP and are recommended for password hashing.
 *
 * @param password The password to hash.
 * @param options The options to hash the password.
 * @returns The salt, hash, and options used to hash the password.
 * @see https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#scrypt
 * @example await createPassword('password', USER_HASH_OPTIONS) // => { salt, hash, options }
 */
export async function createPassword(this: ModuleUser, password: string, options: Partial<PasswordOptions> = {}) {
  const {
    user,
    keylen = 512,
    encoding = 'hex',
    N = 16384,
    r = 8,
    p = 1,
    duration = -1,
    maxmem = 64 * 1024 * 1024,
    salt = randomBytes(32).toString(encoding),
  } = options

  // --- Hash the password using the scrypt algorithm.
  const hashOptions = { N, r, p, maxmem }
  const hash = await new Promise<string>((resolve, reject) =>
    scrypt(password, salt, keylen, hashOptions, (error, derivedKey) => {
      if (error) reject(error)
      else resolve(derivedKey.toString(encoding))
    }))

  // --- Return the new password entity.
  const expiredAt = duration > 0 ? new Date(Date.now() + duration) : undefined
  const passwordOptions = { algorithm: 'scrypt', ...hashOptions, keylen, encoding, salt }
  const { UserPassword } = this.getRepositories()
  return UserPassword.create({ user, hash, expiredAt, options: passwordOptions })
}
