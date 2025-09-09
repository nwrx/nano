import { decrypt } from './decrypt'
import { encrypt } from './encrypt'

describe('decrypt', () => {
  const secret = 'test-secret-key'
  const value = 'test-value'

  describe('decrypt', () => {
    it.each(['aes-256-gcm', 'aes-192-gcm', 'aes-128-gcm'] as const)('should decrypt using %s', async(algorithm) => {
      const encrypted = await encrypt(value, secret, algorithm)
      const decrypted = await decrypt(encrypted, secret)
      expect(decrypted).toBe(value)
    })

    it('should reject with wrong secret', async() => {
      const encrypted = await encrypt(value, secret, 'aes-256-gcm')
      const wrongSecret = 'wrong-secret'
      const shouldReject = decrypt(encrypted, wrongSecret)
      await expect(shouldReject).rejects.toThrow('Unsupported state or unable to authenticate data')
    })

    it('should reject with tampered cipher', async() => {
      const encrypted = await encrypt(value, secret, 'aes-256-gcm')
      encrypted.cipher = encrypted.cipher.replaceAll(/[\dA-Za-z]/g, '0')
      const shouldReject = decrypt(encrypted, secret)
      await expect(shouldReject).rejects.toThrow('Unsupported state or unable to authenticate data')
    })

    it('should reject with tampered tag', async() => {
      const encrypted = await encrypt(value, secret, 'aes-256-gcm')
      encrypted.tag = encrypted.tag.replaceAll(/[\dA-Za-z]/g, '0')
      const shouldReject = decrypt(encrypted, secret)
      await expect(shouldReject).rejects.toThrow('Unsupported state or unable to authenticate data')
    })

    it('should reject with tampered iv', async() => {
      const encrypted = await encrypt(value, secret, 'aes-256-gcm')
      encrypted.iv = encrypted.iv.replaceAll(/[\dA-Za-z]/g, '0')
      const shouldReject = decrypt(encrypted, secret)
      await expect(shouldReject).rejects.toThrow('Unsupported state or unable to authenticate data')
    })

    it('should reject with tampered salt', async() => {
      const encrypted = await encrypt(value, secret, 'aes-256-gcm')
      encrypted.salt = encrypted.salt.replaceAll(/[\dA-Za-z]/g, '0')
      const shouldReject = decrypt(encrypted, secret)
      await expect(shouldReject).rejects.toThrow('Unsupported state or unable to authenticate data')
    })

    it('should reject with invalid algorithm', async() => {
      const encrypted = await encrypt(value, secret, 'aes-256-gcm')
      // @ts-expect-error: invalid algorithm
      const shouldReject = decrypt({ ...encrypted, algorithm: 'aes-256-cbc' }, secret)
      await expect(shouldReject).rejects.toThrow('The algorithm is not supported')
    })

    it('should infer string type by default', async() => {
      const encrypted = await encrypt(value as string, secret, 'aes-256-gcm')
      const decrypted = await decrypt(encrypted, secret)
      expectTypeOf(decrypted).toEqualTypeOf<string>()
    })
  })

  describe('parsing', () => {
    it('should decrypt JSON value', async() => {
      const object = { foo: 'bar', num: 42, nested: { a: 1, b: [1, 2, 3] } }
      const encrypted = await encrypt(object, secret, 'aes-256-gcm')
      const decrypted = await decrypt(encrypted, secret)
      expect(decrypted).toStrictEqual(object)
    })

    it('should infer object type when encrypting object', async() => {
      const object = { foo: 'bar', num: 42, nested: { a: 1, b: [1, 2, 3] } }
      const encrypted = await encrypt(object, secret, 'aes-256-gcm')
      const decrypted = await decrypt(encrypted, secret)
      expectTypeOf(decrypted).toEqualTypeOf<typeof object>()
    })
  })
})
