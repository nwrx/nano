import { createTotp } from './createTotp'
import { createTotpCode } from './createTotpCode'

describe('createTotpCode', () => {
  const secret = Buffer.from('Hello!').toString('base64')

  describe('basic code generation', () => {
    it('should generate a valid TOTP code', () => {
      const totp = createTotp({ secret })
      const code = createTotpCode(totp)
      expect(code).toBeTypeOf('string')
      expect(code).toMatch(/^\d{6}$/)
    })

    it('should generate consistent codes for the same time step', () => {
      const totp = createTotp({ secret })
      const timeStep = 1000
      const code1 = createTotpCode(totp, { timeStep })
      const code2 = createTotpCode(totp, { timeStep })
      expect(code1).toBe(code2)
    })

    it('should generate different codes for different time steps', () => {
      const totp = createTotp({ secret })
      const code1 = createTotpCode(totp, { timeStep: 1000 })
      const code2 = createTotpCode(totp, { timeStep: 1001 })
      expect(code1).not.toBe(code2)
    })

    it('should generate 4-digit codes when configured', () => {
      const totp4 = createTotp({ secret, digits: 4 })
      const code4 = createTotpCode(totp4, { timeStep: 1000 })
      expect(code4).toMatch(/^\d{4}$/)
    })

    it('should generate 8-digit codes when configured', () => {
      const totp8 = createTotp({ secret, digits: 8 })
      const code8 = createTotpCode(totp8, { timeStep: 1000 })
      expect(code8).toMatch(/^\d{8}$/)
    })
  })

  describe('known test vectors', () => {
    it('should generate expected codes for known inputs (SHA1)', () => {
      const totp = createTotp({ secret, algorithm: 'SHA1', digits: 6, period: 30 })
      const code = createTotpCode(totp, { timeStep: 1 })
      expect(code).toBe('945916')
    })

    it('should generate expected 4-digit code for known input', () => {
      const totp4 = createTotp({ secret, digits: 4 })
      const code4 = createTotpCode(totp4, { timeStep: 1 })
      expect(code4).toBe('5916')
    })

    it('should generate expected 8-digit code for known input', () => {
      const totp8 = createTotp({ secret, digits: 8 })
      const code8 = createTotpCode(totp8, { timeStep: 1 })
      expect(code8).toBe('91945916')
    })
  })

  describe('different algorithms', () => {
    it.each(['SHA1', 'SHA256', 'SHA512'] as const)('should generate codes with %s algorithm', (algorithm) => {
      const totp = createTotp({ secret, algorithm })
      const code = createTotpCode(totp, { timeStep: 1000 })
      expect(code).toBeTypeOf('string')
      expect(code).toMatch(/^\d{6}$/)
    })

    it('should generate different codes for SHA1 vs SHA256', () => {
      const totpSHA1 = createTotp({ secret, algorithm: 'SHA1' })
      const totpSHA256 = createTotp({ secret, algorithm: 'SHA256' })

      const timeStep = 1000
      const codeSHA1 = createTotpCode(totpSHA1, { timeStep })
      const codeSHA256 = createTotpCode(totpSHA256, { timeStep })

      expect(codeSHA1).not.toBe(codeSHA256)
    })

    it('should generate different codes for SHA1 vs SHA512', () => {
      const totpSHA1 = createTotp({ secret, algorithm: 'SHA1' })
      const totpSHA512 = createTotp({ secret, algorithm: 'SHA512' })

      const timeStep = 1000
      const codeSHA1 = createTotpCode(totpSHA1, { timeStep })
      const codeSHA512 = createTotpCode(totpSHA512, { timeStep })

      expect(codeSHA1).not.toBe(codeSHA512)
    })

    it('should generate different codes for SHA256 vs SHA512', () => {
      const totpSHA256 = createTotp({ secret, algorithm: 'SHA256' })
      const totpSHA512 = createTotp({ secret, algorithm: 'SHA512' })

      const timeStep = 1000
      const codeSHA256 = createTotpCode(totpSHA256, { timeStep })
      const codeSHA512 = createTotpCode(totpSHA512, { timeStep })

      expect(codeSHA256).not.toBe(codeSHA512)
    })
  })

  describe('time-based generation', () => {
    it('should use current time when no timeStep provided', () => {
      const totp = createTotp({ secret })
      const code = createTotpCode(totp)
      expect(code).toBeTypeOf('string')
      expect(code).toMatch(/^\d{6}$/)
    })

    it('should generate different codes for different periods with same time', () => {
      const fixedTime = 3600 // 1 hour in seconds
      const totp30 = createTotp({ secret, period: 30 })
      const totp60 = createTotp({ secret, period: 60 })
      const code30 = createTotpCode(totp30, { timeStep: Math.floor(fixedTime / 30) })
      const code60 = createTotpCode(totp60, { timeStep: Math.floor(fixedTime / 60) })
      expect(code30).not.toBe(code60)
    })
  })

  describe('padding and formatting', () => {
    it('should pad codes with leading zeros when needed', () => {
      const totp = createTotp({ secret: 'AAAA' })
      const code = createTotpCode(totp, { timeStep: 0 })
      expect(code).toMatch(/^\d{6}$/)
    })

    it('should maintain correct code length', () => {
      const totp = createTotp({ secret: 'AAAA' })
      const code = createTotpCode(totp, { timeStep: 0 })
      expect(code.length).toBe(6)
    })

    it.each([
      { digits: 4, expected: /^\d{4}$/ },
      { digits: 5, expected: /^\d{5}$/ },
      { digits: 6, expected: /^\d{6}$/ },
      { digits: 7, expected: /^\d{7}$/ },
      { digits: 8, expected: /^\d{8}$/ },
    ])('should handle digit length %i correctly', ({ digits, expected }) => {
      const totp = createTotp({ secret, digits })
      const code = createTotpCode(totp, { timeStep: 1000 })
      expect(code).toMatch(expected)
    })
  })
})
