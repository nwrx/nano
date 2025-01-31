/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import { createContext } from '../../__fixtures__'
import { createPassword } from './createPassword'

describe.concurrent<Context>('createPassword', (it) => {
  beforeEach<Context>(async(context) => {
    context.ctx = await createContext()
    await context.ctx.createServer()
  })

  afterEach<Context>(async(context) => {
    await context.ctx.destroy()
  })

  it('should return the hash of the password', async({ expect, ctx }) => {
    const { user } = await ctx.createUser('jdoe')
    const { hash } = await createPassword.call(ctx.ModuleUser, user, 'password')
    expect(hash).toBeTypeOf('string')
    expect(hash).toHaveLength(64)
  })

  it('should return the options used to hash the password', async({ expect, ctx }) => {
    const { user } = await ctx.createUser('jdoe')
    const { options } = await createPassword.call(ctx.ModuleUser, user, 'password')
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

  it('should return the hash of the password with the provided salt', async({ expect, ctx }) => {
    const { user } = await ctx.createUser('jdoe')
    const result = await createPassword.call(ctx.ModuleUser, user, 'password', { salt: 'salt' })
    expect(result).toMatchObject({
      hash: '745731af4484f323968969eda289aeee005b5903ac561e64a5aca121797bf773',
      options: expect.objectContaining({ salt: 'salt' }),
    })
  })

  it('should not generate the same hash for the same password', async({ expect, ctx }) => {
    const { user } = await ctx.createUser('jdoe')
    const result1 = await createPassword.call(ctx.ModuleUser, user, 'password')
    const result2 = await createPassword.call(ctx.ModuleUser, user, 'password')
    expect(result1.hash).not.toStrictEqual(result2.hash)
  })
})
