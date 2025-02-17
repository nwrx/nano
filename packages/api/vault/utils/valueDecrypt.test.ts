import { valueDecrypt } from './valueDecrypt'
import { valueEncrypt } from './valueEncrypt'

describe('valueDecrypt', () => {
  const secret = 'test-secret-key'
  const value = 'test-value'

  it('should decrypt an encrypted value', async() => {
    const encrypted = await valueEncrypt(value, secret, 'aes-256-gcm')
    const decrypted = await valueDecrypt(encrypted, secret)
    expect(decrypted).toBe(value)
  })

  it.each(['aes-256-gcm', 'aes-192-gcm', 'aes-128-gcm'] as const)('should decrypt using %s', async(algorithm) => {
    const encrypted = await valueEncrypt(value, secret, algorithm)
    const decrypted = await valueDecrypt(encrypted, secret)
    expect(decrypted).toBe(value)
  })

  it('should reject with wrong secret', async() => {
    const encrypted = await valueEncrypt(value, secret, 'aes-256-gcm')
    const wrongSecret = 'wrong-secret'
    const shouldReject = valueDecrypt(encrypted, wrongSecret)
    await expect(shouldReject).rejects.toThrow('Unsupported state or unable to authenticate data')
  })

  it('should reject with tampered cipher', async() => {
    const encrypted = await valueEncrypt(value, secret, 'aes-256-gcm')
    encrypted.cipher = encrypted.cipher.replaceAll(/[\dA-Za-z]/g, '0')
    const shouldReject = valueDecrypt(encrypted, secret)
    await expect(shouldReject).rejects.toThrow('Unsupported state or unable to authenticate data')
  })

  it('should reject with tampered tag', async() => {
    const encrypted = await valueEncrypt(value, secret, 'aes-256-gcm')
    encrypted.tag = encrypted.tag.replaceAll(/[\dA-Za-z]/g, '0')
    const shouldReject = valueDecrypt(encrypted, secret)
    await expect(shouldReject).rejects.toThrow('Unsupported state or unable to authenticate data')
  })

  it('should reject with tampered iv', async() => {
    const encrypted = await valueEncrypt(value, secret, 'aes-256-gcm')
    encrypted.iv = encrypted.iv.replaceAll(/[\dA-Za-z]/g, '0')
    const shouldReject = valueDecrypt(encrypted, secret)
    await expect(shouldReject).rejects.toThrow('Unsupported state or unable to authenticate data')
  })

  it('should reject with tampered salt', async() => {
    const encrypted = await valueEncrypt(value, secret, 'aes-256-gcm')
    encrypted.salt = encrypted.salt.replaceAll(/[\dA-Za-z]/g, '0')
    const shouldReject = valueDecrypt(encrypted, secret)
    await expect(shouldReject).rejects.toThrow('Unsupported state or unable to authenticate data')
  })

  it('should reject with invalid algorithm', async() => {
    const encrypted = await valueEncrypt(value, secret, 'aes-256-gcm')
    // @ts-expect-error: invalid algorithm
    const shouldReject = valueDecrypt({ ...encrypted, algorithm: 'aes-256-cbc' }, secret)
    await expect(shouldReject).rejects.toThrow('The algorithm is not supported')
  })
})
