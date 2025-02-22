/* eslint-disable sonarjs/no-hardcoded-passwords */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import { createTestContext } from '../../__fixtures__'
import { createPassword } from './createPassword'

describe.concurrent<Context>('authenticate', (it) => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
    await context.application.createTestServer()
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  it('should return the hash of the password', async({ moduleUser }) => {
    const { hash } = await createPassword.call(moduleUser, { password: 'password' })
    expect(hash).toBeTypeOf('string')
    expect(hash).toMatch(/^[\da-f]{1024}$/)
  })

  it('should return the options used to hash the password', async({ moduleUser }) => {
    const { options } = await createPassword.call(moduleUser, { password: 'password' })
    expect(options).toMatchObject({
      algorithm: 'scrypt',
      N: 16384,
      r: 8,
      p: 1,
      maxmem: 67108864,
      keylen: 512,
      encoding: 'hex',
      salt: expect.stringMatching(/^[\da-f]{64}$/),
    })
  })

  it('should return the hash of the password with the provided salt', async({ moduleUser }) => {
    const result = await createPassword.call(moduleUser, { password: 'password', salt: 'salt' })
    expect(result).toMatchObject({
      hash: '745731af4484f323968969eda289aeee005b5903ac561e64a5aca121797bf7734ef9fd58422e2e22183bcacba9ec87ba0c83b7a2e788f03ce0da06463433cda64176095fbbad7dc98c33fd75955b4b29c94f6e97617bd68d8ff17cf1ed5ad12f3fc6c8eb5b844f2d003ebaf5eaed19e8f665928472a6941f7efc6ebcdd6fd13ad958c4e635472f5824f4ab635a0433f289f6ef93c1eb0070c77b7456dc94babca4e4f3165536e793d191c0064df0a822d3864d5b3776f50489e9b721d55a239e27744c68e3885bc64e7f599626fc62306b893f2c6f149ba200cf789e216a453cd03e0eba0887d62877055ac8fbb5843744dc27baa23f5a74541b1a05bc92ca34a703b80d108af6822582b8144dfc1145f52a39b5398b7d89f338e72084323f1a4bd32efbbbb48ceda39dab752fa20fcfcbf21e6e784f11944557944b9be026809acaf0f9f4847bea25790cc094ddb2dec5dc42ad7080dd1a01ba2c1e971e9f1347a76da18f3e5817fd0f1f134f143217a789686c32e3f7f5f231f33b27296a1dea8a9f8b9f6904be4da248fa082dc47c9929df38c2c9cbc75a1b9abfbc6f5567ce87243058eb0535715edaff7a8d4521a7e800747b0c9a0e228f19743b759d3180083e07ba1f268e152f3ab59b4e4d1f8150b736831371ec6d0a60744fda9d6e3d0e0beaef9860c2ab77335b042f82494ed8161485a3f086b18f23dbc99aa7c1',
      options: expect.objectContaining({ salt: 'salt' }),
    })
  })

  it('should return the hash of the password with the provided key length', async({ moduleUser }) => {
    const result = await createPassword.call(moduleUser, { password: 'password', salt: 'salt', keylen: 8 })
    expect(result).toMatchObject({
      hash: '745731af4484f323',
      options: expect.objectContaining({ salt: 'salt' }),
    })
  })

  it('should not generate the same hash for the same password', async({ moduleUser }) => {
    const result1 = await createPassword.call(moduleUser, { password: 'password' })
    const result2 = await createPassword.call(moduleUser, { password: 'password' })
    expect(result1.hash).not.toStrictEqual(result2.hash)
  })
})
