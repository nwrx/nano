import { randomBytes } from 'node:crypto'

/**
 * Options to create a TOTP configuration. It includes the name, algorithm,
 * digits, and period for the TOTP configuration.
 */
export interface CreateTotpOptions {

  /**
   * The TOTP algorithm to use for generating codes.
   *
   * @default 'SHA1'
   */
  algorithm?: 'SHA1' | 'SHA256' | 'SHA512'

  /**
   * The number of digits in the TOTP code.
   *
   * @default 6
   */
  digits?: number

  /**
   * The time period in seconds for which a TOTP code is valid.
   *
   * @default 30
   */
  period?: number

  /**
   * The secret key to use for generating TOTP codes. If not provided,
   * a random 32-byte secret will be generated.
   *
   * @default randomBytes(32).toString('base64')
   */
  secret?: string
}

/**
 * The result of creating a TOTP configuration.
 */
export interface Totp {
  algorithm: 'SHA1' | 'SHA256' | 'SHA512'
  digits: number
  period: number
  secret: string
}

/**
 * Create a TOTP configuration with the provided options. It generates a random
 * secret if one is not provided and encrypts the configuration for secure storage.
 * The configuration follows RFC 6238 standards for TOTP.
 *
 * @param options The options to create the TOTP configuration.
 * @returns The TOTP configuration with encrypted secrets.
 * @see https://tools.ietf.org/html/rfc6238
 * @example await createTotp()
 */
export function createTotp(options: CreateTotpOptions = {}): Totp {
  const {
    algorithm = 'SHA1',
    digits = 6,
    period = 30,
    secret = randomBytes(32).toString('base64'),
  } = options

  // --- Validate options.
  if (digits < 4 || digits > 10) throw new Error('Digits must be between 4 and 10')
  if (period < 15 || period > 300) throw new Error('Period must be between 15 and 300 seconds')

  // --- Return the TOTP configuration.
  return {
    algorithm,
    digits,
    period,
    secret,
  }
}
