/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { encrypt } from './encrypt'

describe('encrypt', () => {
  const secret = 'test-secret-key'
  const value = 'test-value'

  it('should encrypt a value', async() => {
    const result = await encrypt(value, secret, 'aes-256-gcm')
    const EXP_B64 = /^[\d+/A-Za-z]*={0,2}$/
    expect(result).toMatchObject({
      iv: expect.stringMatching(EXP_B64),
      tag: expect.stringMatching(EXP_B64),
      salt: expect.stringMatching(EXP_B64),
      cipher: expect.stringMatching(EXP_B64),
      algorithm: 'aes-256-gcm',
    })
  })

  it('should produce different ciphers for same value due to random IV', async() => {
    const result1 = await encrypt(value, secret, 'aes-256-gcm')
    const result2 = await encrypt(value, secret, 'aes-256-gcm')
    expect(result1.cipher).not.toEqual(result2.cipher)
    expect(result1.iv).not.toEqual(result2.iv)
  })

  it.each(['aes-256-gcm', 'aes-192-gcm', 'aes-128-gcm'] as const)('should encrypt using %s', async(algorithm) => {
    const result = await encrypt(value, secret, algorithm)
    expect(result.algorithm).toBe(algorithm)
  })

  it('should reject on invalid algorithm', async() => {
    // @ts-expect-error: invalid algorithm
    const shouldReject = encrypt(value, secret, 'aes-256-cbc')
    await expect(shouldReject).rejects.toThrow()
  })
})
