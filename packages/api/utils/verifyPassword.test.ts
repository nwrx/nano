/* eslint-disable sonarjs/no-hardcoded-passwords */
import { createPassword } from './createPassword'
import { verifyPassword } from './verifyPassword'

describe('verifyPassword', () => {
  const password = 'test-password-123'
  const wrongPassword = 'wrong-password'

  describe('basic verification', () => {
    it('should verify a correct password', async() => {
      const hash = await createPassword({ password })
      const isValid = await verifyPassword(password, hash)
      expect(isValid).toBe(true)
    })

    it('should reject an incorrect password', async() => {
      const hash = await createPassword({ password })
      const isValid = await verifyPassword(wrongPassword, hash)
      expect(isValid).toBe(false)
    })

    it('should verify password with custom options', async() => {
      const options = { password, keylen: 256, N: 8192, r: 4, p: 2 }
      const hash = await createPassword(options)
      const isValid = await verifyPassword(password, hash)
      expect(isValid).toBe(true)
    })
  })

  describe('salt verification', () => {
    it('should verify password with the same salt', async() => {
      const salt = 'fixed-salt-for-testing'
      const hash = await createPassword({ password, salt })
      const isValid = await verifyPassword(password, hash)
      expect(isValid).toBe(true)
    })

    it('should produce consistent results with same salt', async() => {
      const salt = 'fixed-salt-for-testing'
      const hash1 = await createPassword({ password, salt })
      const hash2 = await createPassword({ password, salt })
      const isValid1 = await verifyPassword(password, hash1)
      const isValid2 = await verifyPassword(password, hash2)
      expect(isValid1).toBe(true)
      expect(isValid2).toBe(true)
    })
  })

  describe('different encodings', () => {
    it.each(['hex', 'base64'] as const)('should work with %s encoding', async(encoding) => {
      const hash = await createPassword({ password, encoding })
      const isValid = await verifyPassword(password, hash)
      expect(isValid).toBe(true)
    })
  })

  describe('different key lengths', () => {
    it.each([128, 256, 512, 1024])('should work with keylen %d', async(keylen) => {
      const hash = await createPassword({ password, keylen })
      const isValid = await verifyPassword(password, hash)
      expect(isValid).toBe(true)
      expect(hash.keylen).toBe(keylen)
    })
  })

  describe('scrypt parameters', () => {
    it('should work with different N values', async() => {
      const hash = await createPassword({ password, N: 4096 })
      const isValid = await verifyPassword(password, hash)
      expect(isValid).toBe(true)
      expect(hash.N).toBe(4096)
    })

    it('should work with different r values', async() => {
      const hash = await createPassword({ password, r: 16 })
      const isValid = await verifyPassword(password, hash)
      expect(isValid).toBe(true)
      expect(hash.r).toBe(16)
    })

    it('should work with different p values', async() => {
      const hash = await createPassword({ password, p: 2 })
      const isValid = await verifyPassword(password, hash)
      expect(isValid).toBe(true)
      expect(hash.p).toBe(2)
    })

    it('should work with custom maxmem', async() => {
      const maxmem = 32 * 1024 * 1024 // 32MB
      const hash = await createPassword({ password, maxmem })
      const isValid = await verifyPassword(password, hash)
      expect(isValid).toBe(true)
      expect(hash.maxmem).toBe(maxmem)
    })
  })

  describe('edge cases', () => {
    it('should handle empty password', async() => {
      const emptyPassword = ''
      const hash = await createPassword({ password: emptyPassword })
      const isValid = await verifyPassword(emptyPassword, hash)
      expect(isValid).toBe(true)
    })

    it('should handle very long passwords', async() => {
      const longPassword = 'a'.repeat(1000)
      const hash = await createPassword({ password: longPassword })
      const isValid = await verifyPassword(longPassword, hash)
      expect(isValid).toBe(true)
    })

    it('should handle passwords with special characters', async() => {
      const specialPassword = '!@#$%^&*()_+-=[]{}|;:,.<>?'
      const hash = await createPassword({ password: specialPassword })
      const isValid = await verifyPassword(specialPassword, hash)
      expect(isValid).toBe(true)
    })

    it('should handle unicode passwords', async() => {
      const unicodePassword = '🔐密码测试🔒'
      const hash = await createPassword({ password: unicodePassword })
      const isValid = await verifyPassword(unicodePassword, hash)
      expect(isValid).toBe(true)
    })
  })
})
