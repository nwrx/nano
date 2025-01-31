/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createPassword } from './createPassword'

describe.concurrent('createPassword', () => {
  it('should return the hash of the password', async() => {
    const { hash } = await createPassword('password')
    expect(hash).toBeTypeOf('string')
  })

  it('should return the options used to hash the password', async() => {
    const { options } = await createPassword('password')
    expect(options).toMatchObject({
      algorithm: 'scrypt',
      N: 16384,
      r: 8,
      p: 1,
      maxmem: 67108864,
      keylen: 32,
      encoding: 'hex',
      salt: expect.stringMatching(/^[\da-f]{64}$/),
    })
  })

  it('should return the hash of the password with the provided salt', async() => {
    const result = await createPassword('password', { salt: 'salt' })
    expect(result).toStrictEqual({
      hash: '745731af4484f323968969eda289aeee005b5903ac561e64a5aca121797bf773',
      options: {
        algorithm: 'scrypt',
        N: 16384,
        r: 8,
        p: 1,
        maxmem: 67108864,
        keylen: 32,
        encoding: 'hex',
        salt: 'salt',
      },
    })
  })

  it('should not generate the same hash for the same password', async() => {
    const result1 = await createPassword('password')
    const result2 = await createPassword('password')
    expect(result1.hash).not.toStrictEqual(result2.hash)
  })
})
