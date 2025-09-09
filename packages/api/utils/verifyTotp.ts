import type { Totp } from './createTotp'
import { createTotpCode } from './createTotpCode'

/**
 * Options to verify a TOTP code. It includes the encrypted configuration
 * and the code to verify.
 */
export interface VerifyTotpOptions {

  /**
   * The time window in seconds to allow for clock drift. This allows codes
   * from the previous and next time periods to be valid. Must be between 0 and 10.
   *
   * @default 1
   */
  window?: number

  /**
   * The current time in seconds since epoch. If not provided, the current
   * time will be used. This is useful for testing.
   *
   * @default Math.floor(Date.now() / 1000)
   */
  time?: number
}

/**
 * Verify a TOTP code against the provided configuration. It decrypts the
 * configuration and generates codes for the current time period and surrounding
 * time periods (within the window) to account for clock drift.
 *
 * @param code The TOTP code to verify.
 * @param totp The TOTP configuration containing the secret and algorithm details.
 * @param options The options to verify the TOTP code.
 * @returns True if the code is valid, false otherwise.
 * @see https://tools.ietf.org/html/rfc6238
 * @example await verifyTotp('123456', { totp })
 */
export function verifyTotp(code: string, totp: Totp, options: VerifyTotpOptions = {}): boolean {
  const {
    window = 1,
    time = Math.floor(Date.now() / 1000),
  } = options

  // --- Validate inputs.
  if (!code || !/^\d{4,10}$/.test(code)) return false
  if (window < 0 || window > 10) throw new Error('Window must be between 0 and 10')

  // --- Validate TOTP configuration.
  const { secret, algorithm, digits, period } = totp
  if (!secret || !algorithm || !digits || !period) return false
  if (digits < 4 || digits > 10) return false
  if (period < 15 || period > 300) return false

  // --- Generate codes for the current time step and surrounding time steps.
  const currentTimeStep = Math.floor(time / period)
  for (let i = -window; i <= window; i++) {
    const timeStep = currentTimeStep + i
    const expectedCode = createTotpCode(totp, { timeStep })

    // --- Compare the codes in a time-safe manner to prevent timing attacks.
    if (code.length === expectedCode.length) {
      let match = true
      for (const [index, char] of [...code].entries())
        if (char !== expectedCode[index]) match = false
      if (match) return true
    }
  }
  return false
}
