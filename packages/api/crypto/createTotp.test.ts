/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createTotp } from './createTotp'

describe('createTotp', () => {
  describe('basic creation', () => {
    it('should create a TOTP configuration with default values', () => {
      const totp = createTotp()
      expect(totp).toStrictEqual({ algorithm: 'SHA1', digits: 6, period: 30, secret: expect.any(String) })
    })

    it('should create a TOTP configuration with custom values', () => {
      const totp = createTotp({ algorithm: 'SHA256', digits: 8, period: 60, secret: 'JBSWY3DPEHPK3PXP' })
      expect(totp).toStrictEqual({ algorithm: 'SHA256', digits: 8, period: 60, secret: 'JBSWY3DPEHPK3PXP' })
    })

    it('should generate different secrets for each configuration', () => {
      const totp1 = createTotp()
      const totp2 = createTotp()
      expect(totp1.secret).not.toBe(totp2.secret)
    })
  })

  describe('algorithms', () => {
    it.each(['SHA1', 'SHA256', 'SHA512'] as const)('should support %s algorithm', (algorithm) => {
      const totp = createTotp({ algorithm })
      expect(totp.algorithm).toBe(algorithm)
    })
  })

  describe('digits', () => {
    it('should handle minimum valid digits (4)', () => {
      const totp = createTotp({ digits: 4 })
      expect(totp.digits).toBe(4)
    })

    it('should throw an error for invalid digits (too low)', () => {
      const shouldThrow = () => createTotp({ digits: 3 })
      expect(shouldThrow).toThrow('Digits must be between 4 and 10')
    })

    it('should throw an error for invalid digits (too high)', () => {
      const shouldThrow = () => createTotp({ digits: 11 })
      expect(shouldThrow).toThrow('Digits must be between 4 and 10')
    })
  })

  describe('period', () => {
    it('should handle minimum valid period (15)', () => {
      const totp = createTotp({ period: 15 })
      expect(totp.period).toBe(15)
    })

    it('should handle maximum valid period (300)', () => {
      const totp = createTotp({ period: 300 })
      expect(totp.period).toBe(300)
    })

    it('should throw an error for invalid period (too low)', () => {
      const shouldThrow = () => createTotp({ period: 10 })
      expect(shouldThrow).toThrow('Period must be between 15 and 300 seconds')
    })

    it('should throw an error for invalid period (too high)', () => {
      const shouldThrow = () => createTotp({ period: 400 })
      expect(shouldThrow).toThrow('Period must be between 15 and 300 seconds')
    })
  })
})
