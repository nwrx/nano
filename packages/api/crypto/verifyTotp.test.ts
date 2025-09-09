import { createTotp } from './createTotp'
import { createTotpCode } from './createTotpCode'
import { verifyTotp } from './verifyTotp'

describe('verifyTotp', () => {
  const secret = Buffer.from('Hello!').toString('base64')

  describe('basic verification', () => {
    it('should verify a valid TOTP code', () => {
      const totp = createTotp()
      const code = createTotpCode(totp)
      const isValid = verifyTotp(code, totp)
      expect(isValid).toBe(true)
    })

    it('should reject an invalid TOTP code', () => {
      const totp = createTotp()
      const isValid = verifyTotp('000000', totp)
      expect(isValid).toBe(false)
    })

    it('should reject non-numeric codes', () => {
      const totp = createTotp()
      const isValid = verifyTotp('abcdef', totp)
      expect(isValid).toBe(false)
    })

    it('should reject empty codes', () => {
      const totp = createTotp()
      const isValid = verifyTotp('', totp)
      expect(isValid).toBe(false)
    })

    it('should reject codes that are too short', () => {
      const totp = createTotp()
      const isValid = verifyTotp('123', totp)
      expect(isValid).toBe(false)
    })

    it('should reject codes that are too long', () => {
      const totp = createTotp()
      const isValid = verifyTotp('12345678901', totp)
      expect(isValid).toBe(false)
    })
  })

  describe('time window verification', () => {
    it('should accept codes from previous time period within window', () => {
      const totp = createTotp({ period: 30, secret })
      const isValid = verifyTotp('914136', totp, { time: 30 })
      expect(isValid).toBe(true)
    })

    it('should accept codes from next time period within window', () => {
      const totp = createTotp({ period: 30, secret })
      const isValid = verifyTotp('595191', totp, { time: 60 })
      expect(isValid).toBe(true)
    })

    it('should reject codes outside the time window', () => {
      const totp = createTotp({ period: 30, secret })
      const isValid = verifyTotp('914136', totp, { time: 90 })
      expect(isValid).toBe(false)
    })

    it('should work with zero window (only current time)', () => {
      const totp = createTotp({ period: 30, secret })
      const isValid = verifyTotp('914136', totp, { time: 0, window: 0 })
      expect(isValid).toBe(true)
    })

    it('should reject previous period code with zero window', () => {
      const totp = createTotp({ period: 30, secret })
      const isValid = verifyTotp('914136', totp, { time: 30, window: 0 })
      expect(isValid).toBe(false)
    })
  })

  describe('different algorithms', () => {
    it.each(['SHA1', 'SHA256', 'SHA512'] as const)('should work with %s algorithm', (algorithm) => {
      const totp = createTotp({ algorithm })
      const code = createTotpCode(totp)
      const isValid = verifyTotp(code, totp)
      expect(isValid).toBe(true)
    })
  })

  describe('different digit lengths', () => {
    it('should work with 4-digit codes', () => {
      const totp = createTotp({ digits: 4, secret })
      const isValid = verifyTotp('4136', totp, { time: 30 })
      expect(isValid).toBe(true)
    })

    it('should work with 8-digit codes', () => {
      const totp = createTotp({ digits: 8, secret })
      const isValid = verifyTotp('91945916', totp, { time: 30 })
      expect(isValid).toBe(true)
    })

    it('should reject invalid 4-digit codes when 6 digits expected', () => {
      const totp = createTotp({ digits: 6, secret })
      const isValid = verifyTotp('4136', totp, { time: 30 })
      expect(isValid).toBe(false)
    })

    it('should reject invalid 8-digit codes when 6 digits expected', () => {
      const totp = createTotp({ digits: 6, secret })
      const isValid = verifyTotp('91945916', totp, { time: 30 })
      expect(isValid).toBe(false)
    })
  })

  describe('error handling', () => {
    it('should return false for invalid encryption secret', () => {
      const totp = createTotp({ secret: 'not-a-valid-base64' })
      const isValid = verifyTotp('123456', totp)
      expect(isValid).toBe(false)
    })

    it('should throw error for invalid window (negative)', () => {
      const totp = createTotp()
      const shouldThrow = () => verifyTotp('123456', totp, { window: -5 })
      expect(shouldThrow).toThrow('Window must be between 0 and 10')
    })

    it('should throw error for invalid window (too large)', () => {
      const totp = createTotp()
      const shouldThrow = () => verifyTotp('123456', totp, { window: 20 })
      expect(shouldThrow).toThrow('Window must be between 0 and 10')
    })
  })
})
