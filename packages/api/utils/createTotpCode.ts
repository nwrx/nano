import type { Totp } from './createTotp'
import { createHmac } from 'node:crypto'

export interface CreateTotpCode {

  /** The time step for which to generate the TOTP code. */
  timeStep?: number
}

/**
 * Generate a TOTP code for a given time period using the provided secret and algorithm.
 *
 * @param totp The TOTP configuration containing the secret, algorithm, digits, and period.
 * @param options The options to generate the TOTP code.
 * @returns The generated TOTP code.
 */
export function createTotpCode(totp: Totp, options: CreateTotpCode = {}): string {
  const { timeStep = Math.floor(Date.now() / 1000 / totp.period) } = options
  const { secret, algorithm, digits } = totp

  // --- Convert the time step to an 8-byte buffer (big-endian).
  const timeBuffer = Buffer.alloc(8)
  timeBuffer.writeUInt32BE(0, 0)
  timeBuffer.writeUInt32BE(timeStep, 4)

  // --- Create HMAC with the secret and time buffer.
  const secretBuffer = Buffer.from(secret, 'base64')
  const hmacAlgorithm = algorithm.toLowerCase().replace('sha', 'sha')
  const hmac = createHmac(hmacAlgorithm, secretBuffer)
  hmac.update(timeBuffer)
  const hash = hmac.digest()

  // --- Dynamic truncation as per RFC 4226.
  const offset = hash.at(-1)! & 0x0F
  const truncatedHash = hash.subarray(offset, offset + 4)
  const code = truncatedHash.readUInt32BE(0) & 0x7FFFFFFF

  // --- Format the code to the specified number of digits.
  return (code % (10 ** digits)).toString().padStart(digits, '0')
}
