import type { Context } from '../../__fixtures__'
import { createContext } from '../../__fixtures__'
import { resolveUser } from './resolveUser'

describe.concurrent<Context>('resolveUser', (it) => {
  beforeEach<Context>(async(context) => {
    context.ctx = await createContext()
  })

  afterEach<Context>(async(context) => {
    await context.ctx.destroy()
  })

  it('should resolve user by username', async({ expect, ctx }) => {
    const { user } = await ctx.createUser('jdoe')
    const result = await resolveUser.call(ctx.ModuleUser, 'jdoe')
    expect(result).toMatchObject({ id: user.id })
  })

  it('should throw an error if user is not found', async({ expect, ctx }) => {
    const shouldReject = resolveUser.call(ctx.ModuleUser, 'non-existent')
    const error = ctx.ModuleUser.errors.USER_NOT_FOUND('non-existent')
    await expect(shouldReject).rejects.toThrow(error)
  })
})
